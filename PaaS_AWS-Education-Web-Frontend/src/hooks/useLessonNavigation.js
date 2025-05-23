// Custom hook to manage lesson navigation
import { useMemo } from 'react';

/**
 * Hook to handle lesson navigation (prev/next lesson)
 * @param {Array} lessons - Array of all lessons in the series
 * @param {string} currentLessonId - ID of the current lesson
 * @returns {Object} - Previous and next lesson objects
 */
const useLessonNavigation = (lessons, currentLessonId) => {
  const navigation = useMemo(() => {
    if (!lessons || !lessons.length || !currentLessonId) {
      return { prevLesson: null, nextLesson: null, currentIndex: -1 };
    }
    
    const currentIndex = lessons.findIndex(lesson => lesson._id === currentLessonId);
    
    if (currentIndex === -1) {
      return { prevLesson: null, nextLesson: null, currentIndex: -1 };
    }
    
    return {
      prevLesson: currentIndex > 0 ? lessons[currentIndex - 1] : null,
      nextLesson: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
      currentIndex
    };
  }, [lessons, currentLessonId]);
  
  return navigation;
};

export default useLessonNavigation;
