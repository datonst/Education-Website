import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    
    let strength = 0;
    
    // Length check
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    
    // Character types
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    return Math.min(5, strength);
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };
  
  const getStrengthText = () => {
    switch (strength) {
      case 0: return '';
      case 1: return 'Very weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="mt-1">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div 
            key={index}
            className={`h-1 w-full rounded-full ${index <= strength ? getStrengthColor() : 'bg-gray-200'} transition-all duration-300`}
          ></div>
        ))}
      </div>
      {password && (
        <p className={`text-xs mt-1 ${strength <= 2 ? 'text-red-500' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {getStrengthText()}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
