import React from 'react';

/**
 * Component hiển thị trạng thái loading
 */
const Loading = ({ size = 'medium' }) => {
    const sizeClass = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-20 w-20'
    }[size] || 'h-12 w-12';

    return (
        <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full ${sizeClass} border-t-2 border-b-2 border-indigo-500`}></div>
        </div>
    );
};

export default Loading;
