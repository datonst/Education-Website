import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import SeriesService from '../services/SeriesService';
import LessonService from '../services/LessonService';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import CreateLessonModal from '../components/lessons/CreateLessonModal';
import DeleteLessonModal from '../components/lessons/DeleteLessonModal';
import EditSeriesModal from '../components/series/EditSeriesModal';
import DeleteSeriesModal from '../components/series/DeleteSeriesModal';

const SeriesDetailPage = () => {
    const { seriesId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [series, setSeries] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Modal states
    const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
    const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
    const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
    const [isEditSeriesModalOpen, setIsEditSeriesModalOpen] = useState(false);
    const [isDeleteSeriesModalOpen, setIsDeleteSeriesModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Form states
    const [lessonFormData, setLessonFormData] = useState({
        lesson_title: '',
        lesson_description: '',
        isPublish: false,
    });
    const [seriesFormData, setSeriesFormData] = useState({
        serie_title: '',
        serie_description: '',
        serie_category: '',
        isPublish: false,
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch series details
    useEffect(() => {
        const fetchSeriesDetails = async () => {
            try {
                setLoading(true);
                const seriesData = await SeriesService.getSeriesById(seriesId);
                setSeries(seriesData);

                // Update form data for editing
                setSeriesFormData({
                    serie_title: seriesData.serie_title || seriesData.title,
                    serie_description: seriesData.serie_description,
                    serie_category: seriesData.serie_category,
                    isPublish: seriesData.isPublish,
                });

                const isOwner = user && seriesData.serie_user && user.data._id === seriesData.serie_user;
                setIsOwner(isOwner);

                // Fetch lessons                
                if (isOwner) {
                    const lessonsData = await LessonService.getAllLessons(seriesId);
                    console.log(lessonsData.length)
                    setLessons(lessonsData);
                }
                else {
                    const lessonsData = await LessonService.getAllLessonsPublished(seriesId);
                    setLessons(lessonsData.data);
                }

                setError(null);
            } catch (err) {
                setError('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
                console.error('Error fetching series details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (seriesId) {
            fetchSeriesDetails();
        }
    }, [seriesId, user]);

    // Handle create lesson
    const handleCreateLesson = async (lessonFormData) => {
        try {
            setIsSubmitting(true);

            // Gửi trực tiếp đối tượng FormData đến API
            const createdLesson = await LessonService.createLesson(seriesId, lessonFormData);

            // Thêm bài học mới vào danh sách
            setLessons(prevLessons => [...prevLessons, createdLesson]);

            // Reset dữ liệu form
            setLessonFormData({
                lesson_title: '',
                lesson_description: '',
                isPublish: false,
            });

            setIsCreateLessonModalOpen(false);
        } catch (error) {
            console.error('Error creating lesson:', error);
            // Hiển thị thông báo lỗi phù hợp
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete lesson
    const handleDeleteLesson = async () => {
        if (!selectedLesson) return;

        try {
            setIsSubmitting(true);
            await LessonService.deleteLesson(series._id, selectedLesson._id);

            setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== selectedLesson._id));

            setIsDeleteLessonModalOpen(false);
        } catch (error) {
            setFormErrors({ general: 'Có lỗi xảy ra khi xóa bài học. Vui lòng thử lại.' });
            console.error('Error deleting lesson:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit lesson
    const handleEditLesson = async (updatedLessonData) => {
        if (!selectedLesson) return;

        try {
            setIsSubmitting(true);
            const updatedLesson = await LessonService.updateLesson(series._id, selectedLesson._id, updatedLessonData);

            // Update the lessons array with the updated lesson
            setLessons(prevLessons =>
                prevLessons.map(lesson =>
                    lesson._id === selectedLesson._id ? updatedLesson : lesson
                )
            );

            setIsEditLessonModalOpen(false);
        } catch (error) {
            setFormErrors({ general: 'Có lỗi xảy ra khi cập nhật bài học. Vui lòng thử lại.' });
            console.error('Error updating lesson:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit series
    const handleEditSeries = async (thumbnailFile) => {
        try {
            setIsSubmitting(true);
            const updatedSeries = await SeriesService.updateSeries(seriesId, seriesFormData, thumbnailFile);

            // Update the series data
            setSeries(updatedSeries);

            setIsEditSeriesModalOpen(false);
        } catch (error) {
            setFormErrors({ general: 'Có lỗi xảy ra khi cập nhật thông tin khóa học. Vui lòng thử lại.' });
            console.error('Error updating series:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete series
    const handleDeleteSeries = async () => {
        try {
            setIsSubmitting(true);
            await SeriesService.deleteSeries(seriesId);

            // Navigate back to series management page
            navigate('/manage-series');
        } catch (error) {
            setFormErrors({ general: 'Có lỗi xảy ra khi xóa khóa học. Vui lòng thử lại.' });
            console.error('Error deleting series:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle publish/unpublish series
    const handleTogglePublish = async () => {
        try {
            setIsSubmitting(true);
            const updatedData = {
                ...seriesFormData,
                isPublish: !series.isPublish,
            };

            const updatedSeries = await SeriesService.updateSeries(seriesId, updatedData);

            // Update the series data
            setSeries(updatedSeries);
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật trạng thái xuất bản. Vui lòng thử lại.');
            console.error('Error toggling publish status:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="my-8">
                    <ErrorAlert message={error} />
                </div>
            </MainLayout>
        );
    }

    if (!series) {
        return (
            <MainLayout>
                <div className="my-8">
                    <EmptyState
                        title="Không tìm thấy khóa học"
                        description="Khóa học này không tồn tại hoặc đã bị xóa."
                        actionText="Quay lại danh sách khóa học"
                        actionUrl="/explore"
                    />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
                {/* Series Header - Enhanced for modern UI */}
                <div className="relative h-80 md:h-96 overflow-hidden rounded-t-xl">
                    {series.serie_thumbnail ? (
                        <div className="absolute inset-0 w-full h-full transition-all duration-700 group animate-fadeIn">
                            <img
                                src={series.serie_thumbnail}
                                alt={series.serie_title}
                                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-[1px] group-hover:from-black/70 transition-all duration-700"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 animate-gradient"></div>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 animate-slideInLeft">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="max-w-3xl">
                                <div className="flex flex-wrap gap-2 mb-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${series.isPublish
                                        ? 'bg-green-500 text-white ring-2 ring-green-300 ring-opacity-50'
                                        : 'bg-amber-400 text-amber-900 ring-2 ring-amber-200 ring-opacity-50'
                                        }`}>
                                        {series.isPublish ? 'Đã xuất bản' : 'Bản nháp'}
                                    </span>
                                    {series.serie_category && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm transition-all duration-300 hover:bg-indigo-200">
                                            {series.serie_category}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-md animate-slideUp" style={{ animationDelay: '0.3s' }}>{series.serie_title || series.title}</h1>
                                {series.owner && (
                                    <div className="flex items-center mt-3 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-2 shadow-md">
                                            {series.owner.name ? series.owner.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <p className="text-gray-200">
                                            Giảng viên: <span className="font-medium text-white">{series.owner.name || series.owner.email}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                            {isOwner && (
                                <div className="flex gap-3 mt-4 md:mt-0 animate-slideInRight" style={{ animationDelay: '0.5s' }}>
                                    <Button
                                        onClick={() => setIsEditSeriesModalOpen(true)}
                                        className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all duration-300 transform hover:scale-105 rounded-lg hover:shadow-indigo-500/30"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        onClick={handleTogglePublish}
                                        className={`inline-flex items-center px-4 py-2 font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out text-white ${series.isPublish
                                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/30"
                                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/30"
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        {series.isPublish ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Hủy xuất bản
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Xuất bản
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs - Modern and interactive */}
                <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
                    <nav className="flex flex-wrap overflow-x-auto px-2 -mb-px scrollbar-hide max-w-7xl mx-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`relative px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-300 flex items-center ${activeTab === 'overview'
                                ? 'text-indigo-600 font-semibold'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1.5 transition-transform duration-300 ${activeTab === 'overview' ? 'text-indigo-600 scale-110' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Tổng quan
                            {activeTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-slideInRight"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('lessons')}
                            className={`relative px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-300 flex items-center ${activeTab === 'lessons'
                                ? 'text-indigo-600 font-semibold'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1.5 transition-transform duration-300 ${activeTab === 'lessons' ? 'text-indigo-600 scale-110' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Bài học
                            <span className={`inline-flex items-center justify-center ml-1.5 w-5 h-5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === 'lessons' ? 'bg-indigo-100 text-indigo-600 scale-110' : 'bg-gray-100 text-gray-600'}`}>
                                {lessons.length}
                            </span>
                            {activeTab === 'lessons' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-slideInRight"></div>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Tab content */}
                <div className="p-4 sm:p-6 md:p-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Mô tả khóa học
                                </h2>
                                <div className="prose max-w-none">
                                    {series.serie_description ? (
                                        <p className="text-gray-700 leading-relaxed">{series.serie_description}</p>
                                    ) : (
                                        <div className="p-5 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 animate-pulse-blue">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium">Chưa có mô tả cho khóa học này.</p>
                                                    {isOwner && (
                                                        <p className="text-sm mt-1">Thêm mô tả khóa học sẽ giúp người học hiểu rõ hơn về nội dung và mục tiêu của khóa học.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Thống kê
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-indigo-200 group">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4 group-hover:bg-indigo-200 transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Số bài học</p>
                                                <p className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{lessons.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-200 group">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4 group-hover:bg-emerald-200 transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Học viên</p>
                                                <p className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{series.studentsCount || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-amber-200 group sm:col-span-2 md:col-span-1">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4 group-hover:bg-amber-200 transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Lượt xem</p>
                                                <p className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{series.viewCount || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex justify-end pt-4 animate-slideInRight" style={{ animationDelay: '0.2s' }}>
                                    <Button
                                        onClick={() => setIsDeleteSeriesModalOpen(true)}
                                        className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 rounded-lg flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa khóa học
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'lessons' && (
                        <div className="space-y-4 animate-fadeIn">
                            {isOwner && (
                                <div className="mb-6 flex justify-end">
                                    <Button
                                        onClick={() => setIsCreateLessonModalOpen(true)}
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-indigo-500/30 rounded-lg group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tạo bài học mới
                                    </Button>
                                </div>
                            )}

                            {lessons.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
                                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Chưa có bài học nào</h3>
                                    <p className="text-gray-600 max-w-md">
                                        {isOwner
                                            ? "Hãy tạo bài học đầu tiên cho khóa học này để học viên có thể bắt đầu học!"
                                            : "Giảng viên chưa tạo bài học nào cho khóa học này. Vui lòng quay lại sau."}
                                    </p>
                                    {isOwner && (
                                        <Button
                                            onClick={() => setIsCreateLessonModalOpen(true)}
                                            className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/30 transition-all duration-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Tạo bài học đầu tiên
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Danh sách bài học ({lessons.length})
                                    </h2>

                                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                        <ul className="divide-y divide-gray-200">
                                            {lessons.map((lesson, index) => (
                                                <li
                                                    key={lesson._id}
                                                    className="group hover:bg-indigo-50 transition-colors duration-200"
                                                    style={{
                                                        animationDelay: `${index * 0.1}s`,
                                                        animation: 'fadeIn 0.5s ease-in-out forwards',
                                                        opacity: 0
                                                    }}
                                                >
                                                    <Link
                                                        to={`/series/${seriesId}/lessons/${lesson._id}`}
                                                        className="block p-5"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="flex-shrink-0 rounded-lg overflow-hidden w-16 h-16 shadow-sm group-hover:shadow-md transition-all duration-200">
                                                                    {series.serie_thumbnail ? (
                                                                        <img
                                                                            src={series.serie_thumbnail}
                                                                            alt={lesson.lesson_title}
                                                                            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                                        />
                                                                    ) : (
                                                                        <div className="h-full w-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-200 truncate">
                                                                        {lesson.lesson_title}
                                                                    </h3>
                                                                    <div className="flex items-center mt-1 space-x-2">
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lesson.isPublish
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-amber-100 text-amber-800'
                                                                            }`}>
                                                                            {lesson.isPublish ? 'Đã xuất bản' : 'Bản nháp'}
                                                                        </span>

                                                                        {/* Content type badges */}
                                                                        <div className="flex space-x-1">
                                                                            {lesson.lesson_video && (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                    Video
                                                                                </span>
                                                                            )}

                                                                            {lesson.lesson_documents && lesson.lesson_documents.length > 0 && (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                    </svg>
                                                                                    {lesson.lesson_documents.length} tài liệu
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                                        {lesson.lesson_description}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {isOwner && (
                                                                <div className="flex-shrink-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setSelectedLesson(lesson);
                                                                            setIsEditLessonModalOpen(true);
                                                                        }}
                                                                        className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setSelectedLesson(lesson);
                                                                            setIsDeleteLessonModalOpen(true);
                                                                        }}
                                                                        className="text-gray-400 hover:text-red-600 focus:outline-none p-1"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Lesson Modal */}
            {isCreateLessonModalOpen && (
                <CreateLessonModal
                    isOpen={isCreateLessonModalOpen}
                    onClose={() => setIsCreateLessonModalOpen(false)}
                    onSubmit={handleCreateLesson}
                    formData={lessonFormData}
                    setFormData={setLessonFormData}
                    formErrors={formErrors}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Edit Lesson Modal */}
            {isEditLessonModalOpen && selectedLesson && (
                <CreateLessonModal
                    isOpen={isEditLessonModalOpen}
                    onClose={() => setIsEditLessonModalOpen(false)}
                    onSubmit={handleEditLesson}
                    isEdit={true}
                    initialData={selectedLesson}
                    formErrors={formErrors}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Delete Lesson Modal */}
            {isDeleteLessonModalOpen && selectedLesson && (
                <DeleteLessonModal
                    isOpen={isDeleteLessonModalOpen}
                    onClose={() => setIsDeleteLessonModalOpen(false)}
                    onConfirm={handleDeleteLesson}
                    lesson={selectedLesson}
                    isDeleting={isSubmitting}
                />
            )}

            {/* Edit Series Modal */}
            {isEditSeriesModalOpen && (
                <EditSeriesModal
                    isOpen={isEditSeriesModalOpen}
                    onClose={() => setIsEditSeriesModalOpen(false)}
                    onSubmit={handleEditSeries}
                    formData={seriesFormData}
                    setFormData={setSeriesFormData}
                    formErrors={formErrors}
                    isSubmitting={isSubmitting}
                    series={series}
                />
            )}

            {/* Delete Series Modal */}
            {isDeleteSeriesModalOpen && (
                <DeleteSeriesModal
                    isOpen={isDeleteSeriesModalOpen}
                    onClose={() => setIsDeleteSeriesModalOpen(false)}
                    onConfirm={handleDeleteSeries}
                    series={series}
                    isDeleting={isSubmitting}
                />
            )}
        </MainLayout>
    );
};

export default SeriesDetailPage;