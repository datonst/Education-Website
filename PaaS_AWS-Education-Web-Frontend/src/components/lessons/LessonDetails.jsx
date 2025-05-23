import React from 'react';

/**
 * Component to display lesson details and attached documents
 * @param {Object} lesson - The lesson object
 */
const LessonDetails = ({ lesson }) => {
    if (!lesson) return null;

    return (
        <div className="prose prose-lg max-w-none">
            {/* Lesson Header */}
            <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-0 mt-0">{lesson.lesson_title}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">                    

                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(lesson.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            {/* Lesson Description */}
            <div className="p-6">
                <div className="prose prose-indigo max-w-none">
                    <p className="text-gray-700 text-base leading-relaxed">{lesson.lesson_description}</p>

                    {lesson.lesson_description && (
                        <div className="mt-6 border-t border-gray-100 pt-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    )}
                </div>

                {/* Attached Documents */}
                {lesson.lesson_documents && lesson.lesson_documents.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-bold text-gray-900">Tài liệu đính kèm</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lesson.lesson_documents.map((document, index) => (
                                <a
                                    key={index}
                                    href={document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                >
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-indigo-200 transition-colors">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">Tài liệu {index + 1}</div>
                                        <div className="text-xs text-gray-500">Nhấn để xem hoặc tải xuống</div>
                                    </div>
                                    <div className="ml-auto">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonDetails;
