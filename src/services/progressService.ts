export interface ProgressData {
  percent: number;
  modules: Array<{ id: string; title: string; completed: boolean; }>;
  lastModule: string;
  notes: string[];
}

let mockProgress: ProgressData = {
  percent: 75,
  modules: [
    { id: 'mod1', title: 'Wound Care', completed: true },
    { id: 'mod2', title: 'CPR Basics', completed: true },
    { id: 'mod3', title: 'Advanced Suturing', completed: false },
  ],
  lastModule: 'Advanced Suturing',
  notes: ['Remember to review CPR steps before next session.'],
};

export const getUserProgress = async (): Promise<ProgressData> => {
  await new Promise((res) => setTimeout(res, 300));
  return mockProgress;
};

export const addNote = async (note: string): Promise<ProgressData> => {
  await new Promise((res) => setTimeout(res, 200));
  mockProgress.notes.push(note);
  return mockProgress;
}; 