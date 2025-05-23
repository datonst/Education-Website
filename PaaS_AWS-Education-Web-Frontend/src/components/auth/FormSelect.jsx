import { useState } from 'react';

const FormSelect = ({
    id,
    label,
    value,
    onChange,
    options = [],
    error = '',
    required = false,
    icon = null,
    disabled = false,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`relative rounded-md shadow-sm ${error ? 'ring-1 ring-red-500' : ''}`}>
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200">
                        {icon}
                    </div>
                )}
                <select
                    id={id}
                    name={id}
                    required={required}
                    className={`block w-full px-4 py-3 ${icon ? 'pl-10' : ''} 
                    rounded-md border-2 focus:outline-none 
                    ${focused ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'} 
                    ${error ? 'border-red-500 text-red-900 placeholder-red-300' : 'placeholder-gray-400'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white hover:shadow focus:shadow-md'}
                    transition-all duration-300 shadow-sm appearance-none`}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default FormSelect;
