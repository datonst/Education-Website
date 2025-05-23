// Custom hook to manage responsive sidebar behavior
import { useState, useEffect } from 'react';

/**
 * Hook to manage responsive sidebar behavior
 * @param {boolean} initialState - Initial state of the sidebar (open or closed)
 * @param {number} breakpoint - Breakpoint at which to auto-close sidebar (in pixels)
 * @returns {[boolean, function]} - Sidebar state and toggle function
 */
const useResponsiveSidebar = (initialState = true, breakpoint = 1024) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialState);
  
  // Handle window resize to auto-toggle sidebar based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoint) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial render
    
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  // Function to toggle sidebar manually
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  return [isSidebarOpen, toggleSidebar];
};

export default useResponsiveSidebar;
