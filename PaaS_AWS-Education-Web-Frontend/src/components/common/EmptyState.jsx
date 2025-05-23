import React from 'react';
import { MagnifyingGlassIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Component hiển thị khi không có dữ liệu
 */
const EmptyState = ({
    icon,
    title,
    message,
    description,
    action
}) => {
    // Render icon based on type
    const renderIcon = () => {
        if (React.isValidElement(icon)) return icon;

        const iconClasses = "w-12 h-12 mx-auto text-gray-400 mb-4";

        switch (icon) {
            case 'search':
                return <MagnifyingGlassIcon className={iconClasses} />;
            case 'error':
                return <ExclamationTriangleIcon className={iconClasses} />;
            case 'document':
            default:
                return <DocumentTextIcon className={iconClasses} />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
            {renderIcon()}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message || description}</p>
            {action}
        </div>
    );
};

export default EmptyState;
