import api from './apiService';

export type CourseStepType = 'info' | 'mcq' | 'finish';

export interface CourseStep {
  id: string;
  type: CourseStepType;
  title: string;
  description: string;
  image?: any;
  // MCQ fields
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

export const getCourseSteps = async (courseId: string): Promise<CourseStep[]> => {
  const response = await api.get(`/courses/${courseId}/steps`);
  return response.data;
}; 