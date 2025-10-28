import api from './apiService';
export const getCourses = async () => (await api.get('/courses')).data;
export const getCourseOverview = async (id: string) => (await api.get(`/courses/${id}/overview`)).data;
export const getCourseSteps = async (id: string) => (await api.get(`/courses/${id}/steps`)).data;
export const enrollCourse = (userId: string, courseId: string) =>
  api.post(`/users/${userId}/courses`, { course_id: courseId });

export default {
  getCourses,
  getCourseOverview,
  getCourseSteps,
  enrollCourse,
};