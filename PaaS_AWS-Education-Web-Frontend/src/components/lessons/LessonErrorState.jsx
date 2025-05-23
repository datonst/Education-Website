import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component to display error states in the lesson page
 * @param {string} error - Error message to display
 * @param {string} seriesId - ID of the series for navigation
 * @param {boolean} notFound - If true, shows not found message instead of error
 */
const LessonErrorState = ({ error, seriesId, notFound = false }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                    {notFound ? 'Không tìm thấy thông tin' : 'Đã xảy ra lỗi'}
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    {notFound
                        ? 'Không tìm thấy thông tin bài học hoặc series.'
                        : error}
                </p>
                <div className="flex justify-center">
                    {seriesId ? (
                        <Link to={`/series/${seriesId}`} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Quay lại series
                        </Link>
                    ) : (
                        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Về trang chủ
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonErrorState;
