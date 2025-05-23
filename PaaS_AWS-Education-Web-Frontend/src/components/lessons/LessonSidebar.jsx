// Component for lesson sidebar with series progress and lesson list
import { Link } from 'react-router-dom';

/**
 * Sidebar component displaying lesson list and series progress
 * @param {Object} series - The series object
 * @param {Array} allLessons - Array of all lessons in the series
 * @param {string} currentLessonId - ID of the currently active lesson
 * @param {boolean} isSidebarOpen - Whether the sidebar is open
 * @param {string} seriesId - The ID of the series
 */
const LessonSidebar = ({
    series,
    allLessons,
    currentLessonId,
    seriesId,
    className,
    style
}) => {
    if (!series || !allLessons) return null;

    // No progress tracking needed

    return (
        <aside
            className={className || `fixed top-16 bottom-0 z-30 left-0 w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
            style={style}
        >
            <div className="h-full flex flex-col overflow-y-auto">        

                {/* Lesson List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="font-medium text-gray-900 mb-3 px-2">Danh sách bài học</h3>

                    {/* If there are sections in the series */}
                    {series.sections && series.sections.length > 0 ? (
                        series.sections.map((section, sectionIndex) => (
                            <div key={section._id || `section-${sectionIndex}`} className="mb-6">
                                <div className="flex items-center px-2 py-1 mb-2 border-b border-gray-100">
                                    <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
                                        {sectionIndex + 1}
                                    </span>
                                    <span className="font-medium text-gray-800">{section.title}</span>
                                </div>

                                <div className="space-y-1">
                                    {section.lessons && section.lessons.map((item, lessonIndex) => (
                                        <Link
                                            key={item._id}
                                            to={`/series/${seriesId}/lessons/${item._id}`}
                                            className={`flex items-center px-3 py-2 rounded-md transition-colors ${item._id === currentLessonId
                                                ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center mr-2 text-xs font-medium text-gray-500">
                                                {lessonIndex + 1}
                                            </span>
                                            <span className="truncate text-sm">{item.lesson_title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        // If no sections, display flat list of lessons
                        <div className="space-y-1">
                            {allLessons.map((item, index) => (
                                <Link
                                    key={item._id}
                                    to={`/series/${seriesId}/lessons/${item._id}`}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${item._id === currentLessonId
                                        ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center mr-2 text-xs font-medium text-gray-500">
                                        {index + 1}
                                    </span>
                                    <span className="truncate text-sm">{item.lesson_title}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default LessonSidebar;
