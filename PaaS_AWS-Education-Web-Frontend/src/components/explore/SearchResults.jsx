import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SeriesCard from './SeriesCard';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import '../../styles/explore.css';

const SearchResults = ({
    results,
    totalResults,
    isLoading,
    error,
    searchQuery,
    page,
    totalPages,
    onPageChange
}) => {
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="mt-12">
                <div className="flex justify-center items-center">
                    <nav className="relative z-0 inline-flex rounded-xl shadow-lg bg-white/80 backdrop-blur-sm border border-slate-200/50 overflow-hidden" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${page === 1
                                ? 'text-slate-400 cursor-not-allowed bg-slate-50'
                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                                }`}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Generate page buttons */}
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            const isCurrentPage = page === pageNum;

                            // Show current page, first, last, and adjacent pages
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= page - 1 && pageNum <= page + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => onPageChange(pageNum)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ${isCurrentPage
                                            ? 'z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                                            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }

                            // Show ellipsis for gaps
                            if (
                                (pageNum === 2 && page > 3) ||
                                (pageNum === totalPages - 1 && page < totalPages - 2)
                            ) {
                                return (
                                    <span
                                        key={pageNum}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-slate-500 bg-slate-50"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return null;
                        })}

                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${page === totalPages
                                ? 'text-slate-400 cursor-not-allowed bg-slate-50'
                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                                }`}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/50 backdrop-blur-sm">
                <Loading message="Đang tìm kiếm khóa học..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-gradient-to-r from-red-50 to-red-100/70 border-l-4 border-red-500 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="flex-1 p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/50 backdrop-blur-sm animate-fade-in">
                <EmptyState
                    icon="search"
                    title="Không tìm thấy kết quả"
                    message={searchQuery
                        ? `Không tìm thấy kết quả cho "${searchQuery}". Vui lòng thử từ khóa khác.`
                        : "Không có khóa học nào phù hợp với bộ lọc hiện tại. Vui lòng thử thay đổi bộ lọc."
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex-1 animate-fade-in">
            {searchQuery && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-800">
                            <span className="text-blue-600 font-bold">{totalResults}</span> kết quả cho
                            <span className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                                "{searchQuery}"
                            </span>
                        </h2>
                        <div className="hidden sm:flex items-center text-sm text-slate-600">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Trang {page} / {totalPages}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((series) => (
                    <div key={series._id} className="transform hover:scale-105 transition-all duration-300">
                        <SeriesCard series={series} />
                    </div>
                ))}
            </div>

            {renderPagination()}
        </div>
    );
};

export default SearchResults;