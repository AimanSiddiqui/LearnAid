import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addNote, getUserProgress, ProgressData } from '../../services/progressService';

interface ProgressState {
  data: ProgressData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchProgress = createAsyncThunk('progress/fetchProgress', async () => {
  return await getUserProgress();
});

export const addUserNote = createAsyncThunk('progress/addUserNote', async (note: string) => {
  return await addNote(note);
});

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load progress';
      })
      .addCase(addUserNote.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default progressSlice.reducer; 