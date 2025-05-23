import React, { useState } from 'react';

const CommentSection = ({ lessonId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([
        {
            id: 1,
            user: {
                name: 'Nguyễn Văn A',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                isInstructor: true
            },
            content: 'Chào các học viên! Có ai gặp khó khăn khi thực hành nội dung bài này không nhỉ?',
            timestamp: '2023-03-30T08:30:00Z',
            likes: 5,
            replies: [
                {
                    id: 2,
                    user: {
                        name: 'Lê Thị B',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    },
                    content: 'Em đang gặp lỗi khi thực hiện setup môi trường như video. Cụ thể là khi chạy lệnh npm install thì bị lỗi "dependency not found".',
                    timestamp: '2023-03-30T10:15:00Z',
                    likes: 0,
                },
                {
                    id: 3,
                    user: {
                        name: 'Nguyễn Văn A',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        isInstructor: true
                    },
                    content: 'Bạn Lê Thị B, bạn thử kiểm tra version của Node.js xem đã đúng với yêu cầu chưa nhé. Hoặc thử chạy với lệnh "npm install --legacy-peer-deps" xem có được không.',
                    timestamp: '2023-03-30T11:20:00Z',
                    likes: 3,
                }
            ]
        },
        {
            id: 4,
            user: {
                name: 'Trần Văn C',
                avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
            },
            content: 'Bài giảng rất hay và dễ hiểu. Tôi đã làm theo hướng dẫn và thành công. Cảm ơn giảng viên!',
            timestamp: '2023-03-29T15:45:00Z',
            likes: 8,
            replies: []
        }
    ]);

    // State để theo dõi comment đang được reply
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newCommentObject = {
            id: Date.now(),
            user: {
                name: 'Bạn',
                avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
            },
            content: newComment,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: []
        };

        setComments([newCommentObject, ...comments]);
        setNewComment('');
    };

    const handleSubmitReply = (e, commentId) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        {
                            id: Date.now(),
                            user: {
                                name: 'Bạn',
                                avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
                            },
                            content: replyContent,
                            timestamp: new Date().toISOString(),
                            likes: 0,
                        }
                    ]
                };
            }
            return comment;
        });

        setComments(updatedComments);
        setReplyContent('');
        setReplyingTo(null);
    };

    const handleLike = (commentId, isReply = false, replyId = null) => {
        setComments(
            comments.map(comment => {
                if (!isReply && comment.id === commentId) {
                    return { ...comment, likes: comment.likes + 1 };
                } else if (isReply && comment.id === commentId) {
                    const updatedReplies = comment.replies.map(reply =>
                        reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
                    );
                    return { ...comment, replies: updatedReplies };
                }
                return comment;
            })
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Thảo luận ({comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)})</h2>

            {/* Comment Form */}
            <div className="mb-8">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                    <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        placeholder="Đặt câu hỏi hoặc chia sẻ ý kiến của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            disabled={!newComment.trim()}
                        >
                            Gửi bình luận
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-200 pb-6">
                        {/* Main Comment */}
                        <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src={comment.user.avatar}
                                        alt={comment.user.name}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    {comment.user.isInstructor && (
                                        <span className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {comment.user.name}
                                        {comment.user.isInstructor && (
                                            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs py-0.5 px-1.5 rounded">
                                                Giảng viên
                                            </span>
                                        )}
                                    </h3>
                                    <span className="ml-2 text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                    <p>{comment.content}</p>
                                </div>
                                <div className="mt-2 flex space-x-4">
                                    <button
                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                        onClick={() => handleLike(comment.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                            />
                                        </svg>
                                        {comment.likes}
                                    </button>
                                    <button
                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                        onClick={() => setReplyingTo(comment.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                            />
                                        </svg>
                                        Trả lời
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                            <div className="mt-4 ml-14">
                                <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="space-y-3">
                                    <textarea
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows="2"
                                        placeholder={`Trả lời ${comment.user.name}...`}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            disabled={!replyContent.trim()}
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                            <div className="mt-4 ml-14 space-y-4">
                                {comment.replies.map(reply => (
                                    <div key={reply.id} className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <img
                                                    src={reply.user.avatar}
                                                    alt={reply.user.name}
                                                    className="h-8 w-8 rounded-full"
                                                />
                                                {reply.user.isInstructor && (
                                                    <span className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <h4 className="text-xs font-medium text-gray-900">
                                                    {reply.user.name}
                                                    {reply.user.isInstructor && (
                                                        <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs py-0.5 px-1 rounded">
                                                            Giảng viên
                                                        </span>
                                                    )}
                                                </h4>
                                                <span className="ml-2 text-xs text-gray-500">{formatDate(reply.timestamp)}</span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-700">
                                                <p>{reply.content}</p>
                                            </div>
                                            <div className="mt-2">
                                                <button
                                                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                                                    onClick={() => handleLike(comment.id, true, reply.id)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                                        />
                                                    </svg>
                                                    {reply.likes}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
