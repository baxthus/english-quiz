import type { Question } from './questions';

export type Result = {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
};

export type Results = Array<Result>;
