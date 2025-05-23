import React from 'react';

/**
 * Component to display a loading state for lessons
 */
const LessonLoadingState = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Đang tải bài học</h2>
                    <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát...</p>
                </div>
            </div>
        </div>
    );
};

export default LessonLoadingState;
