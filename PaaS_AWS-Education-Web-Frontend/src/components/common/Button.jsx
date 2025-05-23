
/**
 * 
 * @param {Object} props - Props của component
 * @param {ReactNode} props.children - Nội dung hiển thị trong button
 * @param {string} props.type - Loại button (button, submit, reset)
 * @param {Function} props.onClick - Hàm xử lý sự kiện khi click
 * @param {string} props.variant - Kiểu dáng của button (primary, secondary, outline, danger, ghost)
 * @param {string} props.size - Kích thước của button (small, medium, large)
 * @param {string} props.className - Class CSS tùy chỉnh thêm
 * @param {boolean} props.disabled - Trạng thái disabled
 * @param {boolean} props.isLoading - Trạng thái đang tải
 * @param {boolean} props.fullWidth - Button có chiếm toàn bộ chiều rộng hay không
 * @param {ReactNode} props.icon - Icon hiển thị trước nội dung
 */
const Button = ({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    size = 'medium',
    className = '',
    disabled = false,
    isLoading = false,
    fullWidth = false,
    icon = null,
}) => {
    // Variant styles
    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-md hover:shadow-lg',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300',
        outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
        danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent shadow-md hover:shadow-lg',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 border-none',
        success: 'bg-green-600 hover:bg-green-700 text-white border border-transparent shadow-md hover:shadow-lg',
    };

    // Size styles
    const sizeStyles = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                inline-flex items-center justify-center rounded-md font-medium 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px]
                ${variantStyles[variant] || variantStyles.primary}
                ${sizeStyles[size] || sizeStyles.medium}
                ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{typeof children === 'string' ? children : 'Đang xử lý...'}</span>
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
