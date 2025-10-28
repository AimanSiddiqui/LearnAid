import scenariosData from '../../assets/data/emergency_scenarios.json';

export interface Scenario {
  id: string;
  scenario: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  image: string;
}

export const getScenarios = async (): Promise<Scenario[]> => {
  return scenariosData;
};

export interface ScenarioAttempt {
  user_id: string;
  scenario_id: string;
  selected_option: string;
  is_correct: boolean;
  attempted_at: string;
}

export const saveScenarioAttempt = async (attempt: ScenarioAttempt) => {
  const attempts = JSON.parse(localStorage.getItem('scenario_attempts') || '[]');
  attempts.push(attempt);
  localStorage.setItem('scenario_attempts', JSON.stringify(attempts));
  return attempt;
}; 