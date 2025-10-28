import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseStep, getCourseSteps } from '../../services/courseStepsService';
import { fetchUserCourseProgress, saveUserCourseProgress } from '../../services/progressService';

interface CourseStepsState {
  steps: CourseStep[];
  currentStepIndex: number;
  loading: boolean;
  error: string | null;
  userAnswers: { [stepId: string]: string };
  currentModuleId: string | null;
}

const initialState: CourseStepsState = {
  steps: [],
  currentStepIndex: 0,
  loading: false,
  error: null,
  userAnswers: {},
  currentModuleId: null,
};

export const fetchCourseSteps = createAsyncThunk('courseSteps/fetchCourseSteps', async (courseId: string) => {
  return await getCourseSteps(courseId);
});

export const fetchCourseProgress = createAsyncThunk('courseSteps/fetchCourseProgress', async (courseId: string) => {
  return await fetchUserCourseProgress(courseId);
});

export const saveCourseProgress = createAsyncThunk('courseSteps/saveCourseProgress', async ({ courseId, currentModuleId }: { courseId: string; currentModuleId: string }, { getState }) => {
  const state = getState() as { courseSteps: CourseStepsState };
  const { steps, currentStepIndex } = state.courseSteps;
  // Completed modules: all steps with index < currentStepIndex
  const completedModuleIds = steps.slice(0, currentStepIndex).map(s => s.id);
  await saveUserCourseProgress(courseId, currentModuleId, completedModuleIds);
  return currentModuleId;
});

const courseStepsSlice = createSlice({
  name: 'courseSteps',
  initialState,
  reducers: {
    submitMCQAnswer(state, action: PayloadAction<{ stepId: string; answer: string }>) {
      state.userAnswers[action.payload.stepId] = action.payload.answer;
    },
    goToNextStep(state) {
      if (state.currentStepIndex < state.steps.length - 1) {
        state.currentStepIndex += 1;
        state.currentModuleId = state.steps[state.currentStepIndex].id;
      }
    },
    goToPrevStep(state) {
      if (state.currentStepIndex > 0) {
        state.currentStepIndex -= 1;
        state.currentModuleId = state.steps[state.currentStepIndex].id;
      }
    },
    resetCourseSteps(state) {
      state.currentStepIndex = 0;
      state.userAnswers = {};
      state.currentModuleId = null;
    },
    setCurrentStepById(state, action: PayloadAction<string>) {
      const idx = state.steps.findIndex(s => s.id === action.payload);
      if (idx !== -1) {
        state.currentStepIndex = idx;
        state.currentModuleId = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.steps = [];
        state.currentStepIndex = 0;
        state.userAnswers = {};
        state.currentModuleId = null;
      })
      .addCase(fetchCourseSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.steps = action.payload;
        // currentStepIndex will be set after progress is loaded
      })
      .addCase(fetchCourseSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load steps';
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        if (action.payload.currentModuleId) {
          const idx = state.steps.findIndex(s => s.id === action.payload.currentModuleId);
          if (idx !== -1) {
            state.currentStepIndex = idx;
            state.currentModuleId = action.payload.currentModuleId;
          }
        }
      })
      .addCase(saveCourseProgress.fulfilled, (state, action) => {
        state.currentModuleId = action.payload;
      });
  },
});

export const { submitMCQAnswer, goToNextStep, goToPrevStep, resetCourseSteps, setCurrentStepById } = courseStepsSlice.actions;
export default courseStepsSlice.reducer; 