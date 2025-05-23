import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import '../../styles/explore.css';

const SearchHero = ({ onSearch, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [animatedText, setAnimatedText] = useState('Khóa học');
    const [highlightedTag, setHighlightedTag] = useState(null);

    // Array of search terms to animate through
    const searchTerms = [
        'Khóa học',
        'Series học tập',
        'Bài giảng',
        'Kỹ năng',
        'Nội dung học tập'
    ];

    // Effect for animating the placeholder text
    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % searchTerms.length;
            setAnimatedText(searchTerms[currentIndex]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Effect for handling scroll state
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    // Suggested tags with icons
    const suggestedTags = [
        { name: "JavaScript", icon: "🟨" },
        { name: "Python", icon: "🐍" },
        { name: "React", icon: "⚛️" },
        { name: "AWS", icon: "☁️" },
        { name: "Machine Learning", icon: "🤖" }
    ];

    return (
        <div className={`w-full transition-all duration-500 ${isScrolled ? 'py-6' : 'py-16 md:py-24'} bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 relative overflow-hidden`}>
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-indigo-600/20 to-blue-600/20"></div>

            {/* Animated blobs */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Glowing stars */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] animate-pulse"></div>
            <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_3px_rgba(255,255,255,0.8)] animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_3px_rgba(255,255,255,0.8)] animate-pulse animation-delay-4000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text mb-4 relative inline-block">
                        <span className="animate-pulse-slow absolute -right-8 -top-6 text-xl md:text-2xl">✨</span>
                        Khám phá tri thức mới
                        <span className="animate-pulse-slow absolute -left-6 -bottom-2 text-xl md:text-2xl">✨</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
                        Tìm kiếm trong hàng ngàn khóa học và series giáo dục chất lượng cao
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-2xl blur-lg transform transition-all duration-500 group-hover:blur-xl group-hover:scale-105"></div>

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-6 w-6 text-purple-300" />
                        </div>

                        <input
                            type="text"
                            placeholder={`Tìm kiếm ${animatedText}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-4 pl-12 pr-20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all text-white text-lg placeholder-white/60"
                        />

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                type="submit"
                                disabled={isLoading || !searchQuery.trim()}
                                className={`px-6 py-2 rounded-xl flex items-center space-x-2 font-medium transition-all duration-300 btn-hover-effect ${isLoading || !searchQuery.trim()
                                    ? 'bg-slate-400/40 text-slate-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-purple-500/30'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                    <>
                                        <span>Tìm</span>
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center mt-8 gap-3">
                        <div className="flex items-center text-white/70 mr-2 font-medium">
                            <SparklesIcon className="h-4 w-4 mr-1" />
                            <p>Gợi ý:</p>
                        </div>
                        {suggestedTags.map((tag) => (
                            <button
                                key={tag.name}
                                onClick={() => {
                                    setSearchQuery(tag.name);
                                    onSearch(tag.name);
                                }}
                                onMouseEnter={() => setHighlightedTag(tag.name)}
                                onMouseLeave={() => setHighlightedTag(null)}
                                className={`px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40 btn-hover-effect shadow-md flex items-center ${highlightedTag === tag.name ? 'scale-110 bg-white/20 border-white/40' : ''}`}
                            >
                                <span className="mr-1.5">{tag.icon}</span>
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHero;