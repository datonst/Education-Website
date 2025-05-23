import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsiveSidebar, useLessonData, useLessonNavigation } from '../../hooks';
import CommentSection from '../courses/CommentSection';
import LessonContent from './LessonContent';
import LessonSidebar from './LessonSidebar';
import LessonNavigation from './LessonNavigation';
import LessonHeader from './LessonHeader';
import LessonDetails from './LessonDetails';
import LessonLoadingState from './LessonLoadingState';
import LessonErrorState from './LessonErrorState';
import '../../styles/lessonDetail.css';
import '../../styles/lessonSidebar.css';

const LessonDetailPage = () => {
    const { seriesId, lessonId } = useParams();
    const navigate = useNavigate();
    const mainContentRef = useRef(null);

    // Custom hooks
    const [isSidebarOpen, toggleSidebar] = useResponsiveSidebar(false, 1024); // Start with sidebar closed on mobile
    const { lesson, series, allLessons, loading, error } = useLessonData(seriesId, lessonId);

    // Find the current index, next and prev lesson
    const { prevLesson, nextLesson } = useLessonNavigation(allLessons, lessonId);

    // Handle series completion navigation
    const handleCompleteSeries = () => {
        navigate(`/series/${seriesId}`);
    };

    if (loading) {
        return <LessonLoadingState />;
    }

    if (error) {
        return <LessonErrorState error={error} seriesId={seriesId} />;
    }

    if (!lesson || !series) {
        return <LessonErrorState notFound={true} seriesId={seriesId} />;
    }

    return (
        <div className="lesson-detail-page min-h-screen flex flex-col bg-gray-50">
            {/* Header Bar */}
            <LessonHeader
                seriesId={seriesId}
                series={series}
                allLessons={allLessons}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Sidebar - Fixed position, always visible on desktop */}
                <LessonSidebar
                    series={series}
                    allLessons={allLessons}
                    currentLessonId={lessonId}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    seriesId={seriesId}
                    className="fixed top-16 bottom-0 z-30 left-0 w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out"
                    style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
                />

                {/* Main Content */}
                <main
                    ref={mainContentRef}
                    className={`w-full transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}
                >
                    <div className="container mx-auto px-4 py-5 lg:px-8">
                        {/* Simple Course Header */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-5 flex items-center">
                            <div className="flex-1">
                                <h1 className="text-xl font-bold text-gray-900">{series.title}</h1>
                                <div className="flex items-center mt-1">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-md">
                                        {series.lesson_category || 'Khóa học'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Video Player - Make it prominent */}
                        <div className="mb-5 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <div className="aspect-video w-full">
                                <LessonContent
                                    lesson={lesson}
                                />
                            </div>
                        </div>

                        {/* Lesson Navigation - Clean and modern */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-5">
                            <LessonNavigation
                                prevLesson={prevLesson}
                                nextLesson={nextLesson}
                                seriesId={seriesId}
                                onCompleteSeries={handleCompleteSeries}
                                toggleSidebar={toggleSidebar}
                                isSidebarOpen={isSidebarOpen}
                            />
                        </div>

                        {/* Content and Comments - Stacked vertically layout */}
                        <div className="space-y-5">
                            {/* Lesson Content - Full width */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Nội dung bài học</h2>
                                    <div className="prose max-w-none">
                                        <LessonDetails lesson={lesson} />
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section - Below content */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-3 text-gray-900 border-b border-gray-100 pb-2 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Thảo luận
                                    </h3>
                                    <CommentSection lessonId={lesson._id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default LessonDetailPage;
