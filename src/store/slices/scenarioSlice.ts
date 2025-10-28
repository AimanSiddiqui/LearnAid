import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getScenarios, saveScenarioAttempt, Scenario, ScenarioAttempt } from '../../services/scenarioService';

interface ScenarioState {
  scenarios: Scenario[];
  currentScenarioIndex: number;
  loading: boolean;
  error: string | null;
  userAnswers: { [scenarioId: string]: string };
  completed: boolean;
  quizScenarios: Scenario[];
  quizMode: boolean;
}

const initialState: ScenarioState = {
  scenarios: [],
  currentScenarioIndex: 0,
  loading: false,
  error: null,
  userAnswers: {},
  completed: false,
  quizScenarios: [],
  quizMode: false,
};

export const fetchScenarios = createAsyncThunk('scenarios/fetchScenarios', async () => {
  return await getScenarios();
});

export const submitScenarioAttempt = createAsyncThunk(
  'scenarios/submitScenarioAttempt',
  async (attempt: ScenarioAttempt) => {
    return await saveScenarioAttempt(attempt);
  }
);

function getRandomScenarios(arr: Scenario[], n: number): Scenario[] {
  // Fisher-Yates shuffle
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

const scenarioSlice = createSlice({
  name: 'scenarios',
  initialState,
  reducers: {
    submitScenarioAnswer(state, action: PayloadAction<{ scenarioId: string; answer: string }>) {
      state.userAnswers[action.payload.scenarioId] = action.payload.answer;
    },
    goToNextScenario(state) {
      const activeList = state.quizMode ? state.quizScenarios : state.scenarios;
      if (state.currentScenarioIndex < activeList.length - 1) {
        state.currentScenarioIndex += 1;
      } else if (!state.completed) {
        state.completed = true;
      }
    },
    goToPrevScenario(state) {
      if (state.currentScenarioIndex > 0) {
        state.currentScenarioIndex -= 1;
      }
    },
    resetScenarios(state) {
      
      state.currentScenarioIndex = 0;
      state.userAnswers = {};
      state.completed = false;
      state.quizScenarios = [];
      state.quizMode = true;
    },
    selectRandomScenarios(state, action: PayloadAction<number>) {
      state.quizScenarios = getRandomScenarios(state.scenarios, action.payload);
      state.currentScenarioIndex = 0;
      state.userAnswers = {};
      state.completed = false;
      state.quizMode = true;
    },
    exitQuizMode(state) {
      state.quizScenarios = [];
      state.quizMode = false;
      state.currentScenarioIndex = 0;
      state.completed = false;
      state.userAnswers = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScenarios.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.scenarios = [];
        state.currentScenarioIndex = 0;
        state.userAnswers = {};
        state.completed = false;
        state.quizScenarios = [];
        state.quizMode = false;
      })
      .addCase(fetchScenarios.fulfilled, (state, action) => {
        state.loading = false;
        state.scenarios = action.payload;
        state.currentScenarioIndex = 0;
        state.userAnswers = {};
        state.completed = false;
        state.quizScenarios = [];
        state.quizMode = false;
      })
      .addCase(fetchScenarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load scenarios';
      });
  },
});

export const { submitScenarioAnswer, goToNextScenario, goToPrevScenario, resetScenarios, selectRandomScenarios, exitQuizMode } = scenarioSlice.actions;
export default scenarioSlice.reducer; 