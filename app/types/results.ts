import type { Cartoon } from './cartoons';

// Individual question result
export type QuestionResult = {
  question: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  };
  userAnswer: string;
  isCorrect: boolean;
};

// Result for a single cartoon (which has 2 questions)
export type CartoonResult = {
  cartoon: Cartoon;
  questionResults: QuestionResult[];
};

// Array of individual question results for the composable
export type Results = Array<QuestionResult>;
