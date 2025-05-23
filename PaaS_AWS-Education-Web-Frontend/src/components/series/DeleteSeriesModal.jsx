import React from 'react';
import Button from '../common/Button';

/**
 * Modal xác nhận xóa series
 */
const DeleteSeriesModal = ({ isOpen, onClose, onConfirm, series, isDeleting }) => {
    if (!isOpen || !series) return null;

    return (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            {/* Overlay với hiệu ứng transition tương tự CreateSeriesModal */}
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Dialog với styling tương tự CreateSeriesModal */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md md:max-w-lg w-full" onClick={e => e.stopPropagation()}>
                {/* Header với gradient tương tự như CreateSeriesModal */}
                <div className="bg-gradient-to-r from-red-600 to-pink-600 px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-white">Xóa Series</h3>
                        <button
                            onClick={onClose}
                            className="bg-transparent rounded-md text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pt-5 pb-4 sm:p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Xác nhận xóa</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Bạn có chắc chắn muốn xóa series "{series?.serie_title || series?.title}"? Hành động này không thể hoàn tác.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <Button
                        onClick={onConfirm}
                        variant="danger"
                        disabled={isDeleting}
                        isLoading={isDeleting}
                        className="w-full mb-2 sm:mb-0 sm:ml-3 sm:w-auto"
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa series'}
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSeriesModal;
