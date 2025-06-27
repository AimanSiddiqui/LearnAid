import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CourseListItem, getCourses } from '../../services/coursesService';

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

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  return await getCourses();
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
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load courses';
      });
  },
});

export default coursesSlice.reducer; 