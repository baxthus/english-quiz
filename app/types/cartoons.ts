import z from 'zod';

export const cartoonSchema = z.object({
  id: z.number(),
  image: z.string(),
  questions: z
    .array(
      z
        .object({
          id: z.number(),
          question: z.string(),
          options: z.array(z.string()).length(4),
          // Should be one of the options
          answer: z.string(),
        })
        .refine((data) => data.options.includes(data.answer), {
          message: 'Answer must be one of the options',
          path: ['answer'],
        }),
    )
    .length(2),
});
export type Cartoon = z.infer<typeof cartoonSchema>;

export const cartoonsSchema = z.array(cartoonSchema).length(5);
export type Cartoons = z.infer<typeof cartoonsSchema>;

export type Question = Cartoon['questions'][0];

export type QuestionResult = {
  question: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  };
  userAnswer: string;
  isCorrect: boolean;
  cartoonId: number;
};

export type CartoonResult = {
  cartoon: Cartoon;
  questionResults: QuestionResult[];
};

export type Results = Array<QuestionResult>;
