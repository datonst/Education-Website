const AuthCard = ({ children, title, subtitle = '', isTransitioning = false }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className={`max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                <div className="text-center mb-6">
                    <div className="mx-auto w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4 transition-all duration-500 hover:bg-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 transition-colors duration-300">{title}</h2>
                    {subtitle && <p className="mt-1 text-sm text-gray-600 transition-colors duration-300">{subtitle}</p>}
                </div>
                <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthCard;
