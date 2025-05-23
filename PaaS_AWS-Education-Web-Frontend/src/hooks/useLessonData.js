import { useState, useEffect } from 'react';
import LessonService from '../services/LessonService';
import SeriesService from '../services/SeriesService';

/**
 * Custom hook to fetch and manage lesson and series data
 * @param {string} seriesId - ID of the series
 * @param {string} lessonId - ID of the lesson
 * @returns {Object} - The lesson, series, and loading/error states
 */
const useLessonData = (seriesId, lessonId) => {
  const [lesson, setLesson] = useState(null);
  const [series, setSeries] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonData = await LessonService.getLessonById(seriesId, lessonId);
        setLesson(lessonData);

        const seriesData = await SeriesService.getSeriesById(seriesId);
        setSeries(seriesData);

        // Fetch all lessons in the series for navigation
        const allLessonsData = await LessonService.getAllLessons(seriesId);
        setAllLessons(allLessonsData);

      } catch (err) {
        console.error("Error fetching lesson or series details:", err);
        setError(err.message || 'Không thể tải dữ liệu bài học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (seriesId && lessonId) {
      fetchData();
    }
  }, [seriesId, lessonId]);

  return {
    lesson,
    series,
    allLessons,
    loading,
    error
  };
};

export default useLessonData;
