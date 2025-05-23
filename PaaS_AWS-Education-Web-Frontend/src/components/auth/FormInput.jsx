import { useState, useEffect, useRef } from 'react';

const FormInput = ({
    id,
    label,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    error = '',
    required = false,
    autoComplete = 'on',
    icon = null,
    readOnly = false,
    disabled = false,
    autoFocus = false,
}) => {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const [isHovered, setIsHovered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    // Update internal state when prop value changes
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);
    
    // Apply autofocus if needed
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleClear = () => {
        setInputValue('');
        // Create a synthetic event object
        const syntheticEvent = {
            target: {
                id,
                value: '',
            },
        };
        onChange(syntheticEvent);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        onChange(e);
    };

    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className={`block text-sm font-medium mb-2 transition-colors duration-200 ${focused ? 'text-indigo-700' : 'text-gray-700'}`}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div 
                className={`relative rounded-md shadow-sm ${error ? 'ring-1 ring-red-500' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {icon && (
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${focused ? 'text-indigo-500' : ''}`}>
                        {icon}
                    </div>
                )}
                <input
                    ref={inputRef}
                    id={id}
                    name={id}
                    type={type === 'password' && showPassword ? 'text' : type}
                    autoComplete={autoComplete}
                    required={required}
                    className={`block w-full px-4 py-3 ${icon ? 'pl-10' : ''} 
                    rounded-md border-2 focus:outline-none 
                    ${focused ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'} 
                    ${error ? 'border-red-500 text-red-900 placeholder-red-300' : 'placeholder-gray-400'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white hover:shadow focus:shadow-md'}
                    transition-all duration-300 shadow-sm ${inputValue ? 'pr-10' : ''}
                    ${type === 'password' ? 'pr-20' : ''}`}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    readOnly={readOnly}
                    disabled={disabled}
                />
                {/* Show password toggle for password fields */}
                {type === 'password' && inputValue && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                )}
                {/* Clear button for non-password fields or when input not empty */}
                {inputValue && (isHovered || focused) && !disabled && !readOnly && type !== 'password' && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={handleClear}
                        aria-label="Clear input"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
