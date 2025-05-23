import { Link } from 'react-router-dom';

/**
 * Component for lesson navigation buttons (prev/next)
 * @param {Object} prevLesson - Previous lesson object
 * @param {Object} nextLesson - Next lesson object
 * @param {string} seriesId - ID of the current series
 * @param {Function} onCompleteSeries - Function to execute when series is completed
 */
const LessonNavigation = ({
    prevLesson,
    nextLesson,
    seriesId,
    onCompleteSeries
}) => {
    return (
        <div className="grid grid-cols-3 w-full">
            {/* Nút trước - luôn nằm ở bên trái */}
            <div className="flex justify-start">
                {prevLesson && (
                    <Link
                        to={`/series/${seriesId}/lessons/${prevLesson._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Bài trước</span>
                    </Link>
                )}
            </div>

            {/* Phần giữa trống */}
            <div className="flex justify-center">
                {/* Đã xóa nút toggle sidebar */}
            </div>

            {/* Nút tiếp theo hoặc hoàn thành ở phía bên phải */}
            <div className="flex justify-end">
                {nextLesson ? (
                    <Link
                        to={`/series/${seriesId}/lessons/${nextLesson._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        <span className="hidden sm:inline">Bài tiếp theo</span>
                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ) : (
                    <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={onCompleteSeries}
                    >
                        <span className="hidden sm:inline">Hoàn thành</span>
                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default LessonNavigation;
