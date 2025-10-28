import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addFeedback, addNote, deleteNote, getMotivationalQuote, getUserProgress, ProgressData, saveModuleReflection, updateNotes } from '../../services/progressService';

interface ProgressState {
  data: ProgressData | null;
  loading: boolean;
  error: string | null;
  quote: string | null;
  quoteLoading: boolean;
  quoteError: string | null;
  reflectionStatus: 'idle' | 'saving' | 'success' | 'error';
  feedbackStatus: 'idle' | 'sending' | 'success' | 'error';
}

const initialState: ProgressState = {
  data: null,
  loading: false,
  error: null,
  quote: null,
  quoteLoading: false,
  quoteError: null,
  reflectionStatus: 'idle',
  feedbackStatus: 'idle',
};

export const fetchProgress = createAsyncThunk('progress/fetchProgress', async ({ userId, courseId }: { userId: string, courseId: string }) => {
  return await getUserProgress(userId, courseId);
});

export const addUserNote = createAsyncThunk('progress/addUserNote', async ({ userId, note, courseId }: { userId: string, note: string, courseId: string }) => {
  return await addNote(userId, note, courseId);
});

export const updateUserNotes = createAsyncThunk('progress/updateUserNotes', async ({ userId, notes, courseId }: { userId: string, notes: string[], courseId: string }) => {
  return await updateNotes(notes);
});

export const deleteUserNote = createAsyncThunk('progress/deleteUserNote', async (index: number) => {
  return await deleteNote(index);
});

export const fetchMotivationalQuote = createAsyncThunk('progress/fetchMotivationalQuote', async () => {
  return await getMotivationalQuote();
});

export const saveModuleReflectionThunk = createAsyncThunk('progress/saveModuleReflection', async (params: { moduleId: string; reflection: string; confidence: number }) => {
  return await saveModuleReflection(params.moduleId, params.reflection, params.confidence);
});

export const sendFeedbackThunk = createAsyncThunk('progress/sendFeedback', async ({ userId, courseId, feedback }: { userId: string, courseId: string, feedback: string }) => {
  await addFeedback(userId, feedback, courseId);
  return feedback;
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
      })
      .addCase(updateUserNotes.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(deleteUserNote.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // Motivational quote
      .addCase(fetchMotivationalQuote.pending, (state) => {
        state.quoteLoading = true;
        state.quoteError = null;
      })
      .addCase(fetchMotivationalQuote.fulfilled, (state, action) => {
        state.quoteLoading = false;
        state.quote = action.payload;
      })
      .addCase(fetchMotivationalQuote.rejected, (state, action) => {
        state.quoteLoading = false;
        state.quoteError = action.error.message || 'Failed to load quote';
      })
      // Module reflection
      .addCase(saveModuleReflectionThunk.pending, (state) => {
        state.reflectionStatus = 'saving';
      })
      .addCase(saveModuleReflectionThunk.fulfilled, (state, action) => {
        state.reflectionStatus = 'success';
        state.data = action.payload;
      })
      .addCase(saveModuleReflectionThunk.rejected, (state) => {
        state.reflectionStatus = 'error';
      })
      // Feedback
      .addCase(sendFeedbackThunk.pending, (state) => {
        state.feedbackStatus = 'sending';
      })
      .addCase(sendFeedbackThunk.fulfilled, (state) => {
        state.feedbackStatus = 'success';
      })
      .addCase(sendFeedbackThunk.rejected, (state) => {
        state.feedbackStatus = 'error';
      });
  },
});

export default progressSlice.reducer; 