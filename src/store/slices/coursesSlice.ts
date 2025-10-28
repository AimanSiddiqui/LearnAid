import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCourses } from '../../services/coursesService';
import { CourseListItem } from '../../types/auth';

interface CoursesState {
  list: CourseListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  list: [],
  loading: false,
  error: null,
};

const COURSE_ICON_MAP: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  'CPR': {
    icon: 'heart-outline',
    iconBg: '#ffeaea',
    iconColor: '#e53935',
  },
  'Emergency First Aid': {
    icon: 'shield-checkmark-outline',
    iconBg: '#e3f0ff',
    iconColor: '#1976d2',
  },
  'Basic Wound Care': {
    icon: 'medkit-outline',
    iconBg: '#eafaf1',
    iconColor: '#43a047',
  },
  'Disaster Preparedness': {
    icon: 'flask-outline',
    iconBg: '#f3eaff',
    iconColor: '#8e24aa',
  },
};

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
let result = await getCourses();
  return result
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.map((course: any) => ({
          ...course,
          ...(COURSE_ICON_MAP[course.title] || {}),
        }));
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load courses';
      });
  },
});

export default coursesSlice.reducer; 