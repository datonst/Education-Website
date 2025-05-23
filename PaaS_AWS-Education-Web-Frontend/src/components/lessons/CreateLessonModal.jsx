import { useState, useEffect } from 'react';

/**
 * Modal để tạo hoặc chỉnh sửa bài học
 */
const CreateLessonModal = ({
    isOpen,
    onClose,
    onSubmit,
    isEdit = false,
    initialData = {}
}) => {
    const [formData, setFormData] = useState({
        lesson_title: '',
        lesson_description: '',
        isPublish: false,
    });

    const [files, setFiles] = useState({
        videoFile: null,
        documentFiles: [], // Array for multiple documents
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form data if editing
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                lesson_title: initialData.lesson_title || '',
                lesson_description: initialData.lesson_description || '',
                isPublish: initialData.isPublish === "true" || initialData.isPublish === true || false,
            });
        }
    }, [isEdit, initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles.length === 0) return;

        // Handle multiple files for documents
        if (name === 'lesson_documents') {
            setFiles(prev => ({ ...prev, documentFiles: Array.from(selectedFiles) }));
        } else if (name === 'lesson_video') {
            setFiles(prev => ({ ...prev, videoFile: selectedFiles[0] }));
        }

        // Clear error when user selects a file
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }

        // Clear general file error if any file is uploaded
        if (errors.files) {
            setErrors({
                ...errors,
                files: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.lesson_title.trim()) {
            newErrors.lesson_title = 'Tiêu đề không được để trống';
        }

        if (!formData.lesson_description.trim()) {
            newErrors.lesson_description = 'Mô tả không được để trống';
        }

        // If creating new lesson, require at least one file upload
        if (!isEdit && !files.videoFile && (!files.documentFiles || files.documentFiles.length === 0)) {
            newErrors.files = 'Phải tải lên ít nhất một video hoặc tài liệu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // Create FormData object to match backend expectations
            const lessonFormData = new FormData();

            // Add text fields
            lessonFormData.append('lesson_title', formData.lesson_title);
            lessonFormData.append('lesson_description', formData.lesson_description);
            lessonFormData.append('isPublish', formData.isPublish);

            // Add binary files with correct field names
            if (files.videoFile) {
                lessonFormData.append('lesson_video', files.videoFile);
            }

            // Add document files as an array
            if (files.documentFiles && files.documentFiles.length > 0) {
                files.documentFiles.forEach(doc => {
                    lessonFormData.append('lesson_documents', doc);
                });
            }

            await onSubmit(lessonFormData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Title */}
                    <div className="mb-4">
                        <label htmlFor="lesson_title" className="block text-sm font-medium text-gray-700">
                            Tiêu đề bài học <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lesson_title"
                            name="lesson_title"
                            value={formData.lesson_title}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${errors.lesson_title ? 'border-red-300' : 'border-gray-300'
                                } shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500`}
                            placeholder="Nhập tiêu đề bài học"
                        />
                        {errors.lesson_title && (
                            <p className="mt-1 text-sm text-red-600">{errors.lesson_title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label htmlFor="lesson_description" className="block text-sm font-medium text-gray-700">
                            Mô tả bài học <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="lesson_description"
                            name="lesson_description"
                            value={formData.lesson_description}
                            onChange={handleInputChange}
                            rows={4}
                            className={`mt-1 block w-full rounded-md border ${errors.lesson_description ? 'border-red-300' : 'border-gray-300'
                                } shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500`}
                            placeholder="Nhập mô tả ngắn về bài học"
                        />
                        {errors.lesson_description && (
                            <p className="mt-1 text-sm text-red-600">{errors.lesson_description}</p>
                        )}
                    </div>

                    {/* File Uploads */}
                    <div className="mb-6 border rounded-md p-4 bg-gray-50">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Tải lên tài nguyên</h4>

                        {/* Video Upload */}
                        <div className="mb-3">
                            <label htmlFor="lesson_video" className="block text-sm font-medium text-gray-700">
                                Video bài học {!isEdit && <span className="text-sm text-gray-500">(bắt buộc nếu không có tài liệu)</span>}
                            </label>
                            <input
                                type="file"
                                id="lesson_video"
                                name="lesson_video"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {isEdit && initialData.lesson_video && !files.videoFile && (
                                <p className="mt-1 text-sm text-green-600">Đã có video (giữ video cũ nếu không tải lên mới)</p>
                            )}
                        </div>

                        {/* Document Upload */}
                        <div className="mb-3">
                            <label htmlFor="lesson_documents" className="block text-sm font-medium text-gray-700">
                                Tài liệu {!isEdit && <span className="text-sm text-gray-500">(bắt buộc nếu không có video)</span>}
                            </label>
                            <input
                                type="file"
                                id="lesson_documents"
                                name="lesson_documents"
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                multiple
                            />
                            {isEdit && initialData.lesson_documents && initialData.lesson_documents.length > 0 && !files.documentFiles.length && (
                                <p className="mt-1 text-sm text-green-600">Đã có {initialData.lesson_documents.length} tài liệu (giữ tài liệu cũ nếu không tải lên mới)</p>
                            )}
                        </div>

                        {errors.files && (
                            <p className="text-sm text-red-600">{errors.files}</p>
                        )}
                    </div>

                    {/* Publish Status */}
                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="isPublish"
                            name="isPublish"
                            checked={formData.isPublish}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPublish" className="ml-2 block text-sm text-gray-900">
                            Xuất bản ngay (hiện bài học cho học viên)
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                        >
                            {isSubmitting && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isEdit ? 'Cập nhật bài học' : 'Tạo bài học'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLessonModal;
