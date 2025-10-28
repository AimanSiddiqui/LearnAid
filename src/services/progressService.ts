import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './apiService';

export interface ProgressData {
  percent: number;
  modules: Array<{ id: string; title: string; completed: boolean; reflection?: string; confidence?: number; }>;
  lastModule: string;
  notes: string[];
}

let mockProgress: ProgressData = {
  percent: 75,
  modules: [
    { id: 'mod1', title: 'Wound Care', completed: true, reflection: '', confidence: undefined },
    { id: 'mod2', title: 'CPR Basics', completed: true, reflection: '', confidence: undefined },
    { id: 'mod3', title: 'Advanced Suturing', completed: false, reflection: '', confidence: undefined },
  ],
  lastModule: 'Advanced Suturing',
  notes: ['Remember to review CPR steps before next session.'],
};

const quotes = [
  'Success is the sum of small efforts, repeated day in and day out.',
  'Learning never exhausts the mind.',
  'The expert in anything was once a beginner.',
  'Every accomplishment starts with the decision to try.',
  'Push yourself, because no one else is going to do it for you.',
  'Small progress is still progress.',
  'Mistakes are proof that you are trying.',
  'Believe you can and you\'re halfway there.',
  'Don\'t watch the clock; do what it does. Keep going.',
  'You don\'t have to be perfect to be amazing.'
];

export const getMotivationalQuote = async (): Promise<string> => {
  await new Promise((res) => setTimeout(res, 150));
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const saveModuleReflection = async (moduleId: string, reflection: string, confidence: number): Promise<ProgressData> => {
  await new Promise((res) => setTimeout(res, 200));
  const mod = mockProgress.modules.find(m => m.id === moduleId);
  if (mod) {
    mod.reflection = reflection;
    mod.confidence = confidence;
  }
  return mockProgress;
};

export const saveFeedback = async (feedback: string): Promise<void> => {
  await new Promise((res) => setTimeout(res, 200));
  // In a real app, this would be sent to the backend
  return;
};

export const getUserProgress = async (userId: string, courseId: string): Promise<ProgressData> => {
  const response = await api.get(`/users/${userId}/courses/${courseId}/progress`);
  return response.data;
};

export const saveUserProgress = (userId: string, courseId: string, data: any) =>
  api.post(`/users/${userId}/courses/${courseId}/progress`, data);

export const addNote = async (userId: string, content: string, courseId: string) => {
  const response = await api.post(`/users/${userId}/notes`, { content, course_id: courseId });
  return response.data;
};

export const addFeedback = async (userId: string, content: string, courseId: string) => {
  const response = await api.post(`/users/${userId}/feedback`, { content, course_id: courseId });
  return response.data;
};

export const updateNotes = async (notes: string[]): Promise<ProgressData> => {
  await new Promise((res) => setTimeout(res, 200));
  mockProgress.notes = notes;
  return mockProgress;
};

export const deleteNote = async (index: number): Promise<ProgressData> => {
  await new Promise((res) => setTimeout(res, 200));
  mockProgress.notes.splice(index, 1);
  return mockProgress;
};

// Simulated API for saving and fetching course step progress
export const fetchUserCourseProgress = async (courseId: string): Promise<{ currentModuleId: string | null }> => {
  const userId = await AsyncStorage.getItem('user').then(u => u ? JSON.parse(u).id : null);
  if (!userId) return { currentModuleId: null };
  const response = await api.get(`/users/${userId}/courses/${courseId}/progress`);
  return { currentModuleId: response.data.currentModuleId || null };
};

export const saveUserCourseProgress = async (courseId: string, currentModuleId: string, completedModuleIds: string[] = []) => {
  const userId = await AsyncStorage.getItem('user').then(u => u ? JSON.parse(u).id : null);
  if (!userId) return;
  await api.post(`/users/${userId}/courses/${courseId}/progress`, {
    current_module_id: currentModuleId,
    completed_module_ids: completedModuleIds,
  });
};

export const getNotes = (userId: string, courseId?: string) =>
  api.get(`/users/${userId}/notes`, { params: { course_id: courseId } });

export default {
  getUserProgress,
  saveUserProgress,
  getNotes,
  addNote,
  addFeedback,
}; 