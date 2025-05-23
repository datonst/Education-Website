import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, UserGroupIcon, ClockIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import '../../styles/explore.css';

const SeriesCard = ({ series }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Helper function to create placeholder image URL with series title
    const getPlaceholderImage = (title) => {        
        const encodedTitle = encodeURIComponent(title || 'Course');
        return `https://ui-avatars.com/api/?name=${encodedTitle}&background=0D8ABC&color=fff&size=600`;
    };

    // Format the rating to show only one decimal place if needed
    const formatRating = (rating) => {
        if (!rating && rating !== 0) return 'N/A';
        return Number.isInteger(rating) ? rating : rating.toFixed(1);
    };

    // Get course difficulty label with appropriate color
    const getDifficultyLabel = () => {
        const difficulty = series.difficulty || 'Beginner';

        const difficultyMap = {
            'Beginner': { label: 'Cơ bản', class: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' },
            'Intermediate': { label: 'Trung cấp', class: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' },
            'Advanced': { label: 'Nâng cao', class: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' },
            'All Levels': { label: 'Tất cả', class: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' },
        };

        const defaultDifficulty = { label: 'Cơ bản', class: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' };
        return difficultyMap[difficulty] || defaultDifficulty;
    };

    // Generate the category badge
    const getCategoryBadge = () => {
        if (!series.serie_category) return null;

        return (
            <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 font-medium shadow-sm">
                {series.serie_category}
            </span>
        );
    };

    // Compute truncated title and description
    const title = series.serie_title || 'Khóa học không có tiêu đề';
    const description = series.serie_description || 'Không có mô tả cho khóa học này.';
    const truncatedDesc = description.length > 120 ? description.substring(0, 117) + '...' : description;

    // Get series thumbnail or placeholder
    const thumbnailUrl = series.serie_thumbnail || getPlaceholderImage(title);

    return (
        <div
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col card-hover-effect"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/series/${series.id || series._id}`} className="block">
                <div className="relative pb-[56.25%] overflow-hidden group">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getPlaceholderImage(title);
                        }}
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badge overlay */}
                    <div className="absolute top-3 right-3">
                        {getCategoryBadge()}
                    </div>
                </div>
            </Link>

            <div className="p-5 flex-grow flex flex-col">
                {/* Title */}
                <Link to={`/series/${series.id || series._id}`} className="block">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {title}
                    </h3>
                </Link>

                {/* Meta information */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {/* Difficulty */}
                    <span className={`px-3 py-1 text-xs rounded-full ${getDifficultyLabel().class} font-medium shadow-sm`}>
                        {getDifficultyLabel().label}
                    </span>

                    {/* Rating if available */}
                    {series.rating !== undefined && (
                        <div className="flex items-center px-3 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 font-medium shadow-sm">
                            <StarIcon className="h-3 w-3 mr-1" />
                            {formatRating(series.rating)}
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {truncatedDesc}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-indigo-500" />
                        <span>{series.students_count || 0} học viên</span>
                    </div>

                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                        <BookOpenIcon className="h-4 w-4 mr-1 text-indigo-500" />
                        <span>{series.serie_lessons.length || 0} bài học</span>
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div className="px-5 pb-5">
                <Link
                    to={`/series/${series.id || series._id}`}
                    className={`block w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg ${isHovered ? 'animate-pulse-blue' : ''}`}
                >
                    Xem khóa học
                </Link>
            </div>
        </div>
    );
};

export default SeriesCard;
