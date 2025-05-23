import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component for the lesson page header
 * @param {string} seriesId - The ID of the series
 * @param {Object} series - The series object containing title
 * @param {Array} allLessons - Array of all lessons
 * @param {boolean} isSidebarOpen - Whether sidebar is open
 * @param {Function} toggleSidebar - Function to toggle sidebar
 */
const LessonHeader = ({ seriesId, series, isSidebarOpen, toggleSidebar }) => {

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center px-4 py-4">
                <div className="flex items-center space-x-4">
                    <Link
                        to={`/series/${seriesId}`}
                        className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors group"
                    >
                        <div className="p-1.5 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors mr-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="font-medium text-sm md:text-base">Quay lại series</span>
                    </Link>
                    <div className="hidden md:flex items-center">
                        <div className="w-px h-6 bg-gray-300 mx-3"></div>
                        <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">{series?.title}</h1>
                    </div>
                </div>

                <div className="flex items-center">
                    {/* Mobile sidebar toggle */}
                    <button
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <span className="sr-only">Mở menu</span>
                        {isSidebarOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default LessonHeader;
