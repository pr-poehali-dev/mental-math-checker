export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TaskType = 'numeral-system' | 'data-units' | 'addition' | 'multiplication' | 'square' | 'mixed';

export interface Task {
  question: string;
  answer: number;
  userAnswer: string;
  type: TaskType;
}

export interface Stats {
  total: number;
  correct: number;
  wrong: number;
  streak: number;
  totalTime: number;
  avgTime: number;
}

export interface TrainingHistory {
  id: string;
  date: string;
  taskType: TaskType;
  difficulty: DifficultyLevel;
  total: number;
  correct: number;
  accuracy: number;
  grade: number;
  totalTime: number;
  avgTime: number;
  userName?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
}