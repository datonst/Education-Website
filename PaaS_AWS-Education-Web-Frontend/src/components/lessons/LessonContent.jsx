import React, { useRef } from 'react';

/**
 * Component to render lesson content (video or document)
 * @param {Object} lesson - The lesson object with content details
 */
const LessonContent = ({ lesson }) => {
    const videoRef = useRef(null);

    if (!lesson) return null;

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6">
            <div className="relative">
                {lesson.lesson_video ? (
                    <div className="aspect-w-16 aspect-h-9 bg-black">
                        <video
                            ref={videoRef}
                            src={lesson.lesson_video}
                            className="w-full h-full object-contain"
                            controls
                            poster={lesson.thumbnail}
                            preload="metadata"
                        />
                    </div>
                ) : lesson.lesson_documents && lesson.lesson_documents.length > 0 ? (
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(lesson.lesson_documents[0])}`}
                            className="w-full h-full"
                            title={lesson.lesson_title}
                            frameBorder="0"
                        />
                    </div>
                ) : (
                    <div className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-gray-100 text-gray-600">
                        <div className="text-center p-6">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <p className="mt-4 text-lg font-medium">Không có nội dung video hoặc tài liệu</p>
                            <p className="mt-2 text-sm text-gray-500">Giảng viên chưa tải lên nội dung cho bài học này</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="py-3 px-4 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{lesson.lesson_title}</h2>
            </div>
        </div>
    );
};

export default LessonContent;