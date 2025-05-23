import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import seriesService from '../services/SeriesService';

/**
 * Custom hook để quản lý logic cho trang quản lý series
 */
const useSeriesManagement = () => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [seriesToDelete, setSeriesToDelete] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newSeries, setNewSeries] = useState({
        serie_title: '',
        serie_description: '',
        serie_category: '',
        isPublish: false,
    });
    const [seriesToEdit, setSeriesToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        serie_title: '',
        serie_description: '',
        serie_category: '',
        isPublish: false,
    });
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchUserSeries();

        // Check if we have the 'action=create' query param to open modal
        const queryParams = new URLSearchParams(location.search);
        const action = queryParams.get('action');
        if (action === 'create') {
            setIsCreateModalOpen(true);
            // Clear the query parameter without reloading the page
            navigate('/series', { replace: true });
        }
    }, [location, navigate]);

    const fetchUserSeries = async () => {
        try {
            setLoading(true);
            const data = await seriesService.getUserSeries();
            setSeries(data || []);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách series. Vui lòng thử lại sau.');
            console.error('Error fetching series:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSeries = async () => {
        if (!seriesToDelete) return;

        try {
            setIsDeleting(true);
            await seriesService.deleteSeries(seriesToDelete._id);
            setSeries(series.filter(item => item._id !== seriesToDelete._id));
            setIsDeleteModalOpen(false);
            setSeriesToDelete(null);
        } catch (err) {
            setError('Không thể xóa series. Vui lòng thử lại sau.');
            console.error('Error deleting series:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.serie_title.trim()) {
            errors.serie_title = 'Tiêu đề không được để trống';
        }
        if (!data.serie_description.trim()) {
            errors.serie_description = 'Mô tả không được để trống';
        }
        if (!data.serie_category.trim()) {
            errors.serie_category = 'Danh mục không được để trống';
        }
        return errors;
    };

    const handleCreateSeries = async (coverImage) => {
        // Validate the form
        const errors = validateForm(newSeries);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setIsSubmitting(true);
            const createdSeries = await seriesService.createSeries(newSeries, coverImage);

            // Add the new series to the list
            setSeries([createdSeries, ...series]);

            // Reset form
            resetForm();

            // Close modal
            setIsCreateModalOpen(false);
        } catch (err) {
            setError('Không thể tạo series mới. Vui lòng thử lại sau.');
            console.error('Error creating series:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenEditModal = (seriesItem) => {
        setSeriesToEdit(seriesItem);
        setEditFormData({
            serie_title: seriesItem.serie_title || '',
            serie_description: seriesItem.serie_description || '',
            serie_category: seriesItem.serie_category || '',
            isPublish: seriesItem.isPublish || false,
        });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    const handleEditSeries = async (coverImage) => {
        if (!seriesToEdit) return;

        // Validate the form
        const errors = validateForm(editFormData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setIsSubmitting(true);
            const updatedSeries = await seriesService.updateSeries(
                seriesToEdit._id,
                editFormData,
                coverImage
            );

            // Update the series in the list
            setSeries(
                series.map((item) => 
                    item._id === updatedSeries._id ? updatedSeries : item
                )
            );

            // Close modal and reset
            setIsEditModalOpen(false);
            setSeriesToEdit(null);
        } catch (err) {
            setError('Không thể cập nhật series. Vui lòng thử lại sau.');
            console.error('Error updating series:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePublish = async (seriesItem) => {
        try {
            // Tạo đối tượng cập nhật chỉ với trường isPublish
            const updateData = {
                isPublish: !(seriesItem.isPublish)
            };
            
            const updatedSeries = await seriesService.updateSeries(
                seriesItem._id,
                updateData
            );

            // Cập nhật danh sách series
            setSeries(
                series.map((item) => 
                    item._id === updatedSeries._id ? updatedSeries : item
                )
            );
        } catch (err) {
            setError(`Không thể ${(seriesItem.isPublish) ? 'hủy xuất bản' : 'xuất bản'} series. Vui lòng thử lại sau.`);
            console.error('Error toggling publish status:', err);
        }
    };

    const resetForm = useCallback(() => {
        setNewSeries({
            serie_title: '',
            serie_description: '',
            serie_category: '',
            isPublish: false,
        });
        setFormErrors({});
    }, []);

    // Filtering and sorting logic
    const filteredSeries = series
        .filter(item => {
            // Filter by search query
            const matchesSearch = item.serie_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.serie_description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by status
            if (filterStatus === 'all') return matchesSearch;
            if (filterStatus === 'published') return matchesSearch && item.isPublish;
            if (filterStatus === 'draft') return matchesSearch && !item.isPublish;

            return matchesSearch;
        })
        .sort((a, b) => {
            // Sort by selected option
            if (sortBy === 'newest') return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
            if (sortBy === 'oldest') return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
            if (sortBy === 'alphabetical') return (a.serie_title || '').localeCompare(b.serie_title || '');
            if (sortBy === 'popular') return (b.studentsCount || 0) - (a.studentsCount || 0);

            return 0;
        });

    return {
        series: filteredSeries,
        loading,
        error,
        setError,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        seriesToDelete,
        setSeriesToDelete,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        newSeries,
        setNewSeries,
        editFormData,
        setEditFormData,
        seriesToEdit,
        formErrors,
        setFormErrors,
        isSubmitting,
        isDeleting,
        handleDeleteSeries,
        handleCreateSeries,
        handleEditSeries,
        handleOpenEditModal,
        handleTogglePublish,
        resetForm,
    };
};

export default useSeriesManagement;
