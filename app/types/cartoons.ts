import z from 'zod';

const questionSchema = z
  .object({
    id: z.number(),
    question: z.string(),
    options: z.array(z.string()).length(4),
    answer: z.string(),
  })
  .refine((data) => data.options.includes(data.answer), {
    message: 'Answer must be one of the options',
    path: ['answer'],
  });

export const cartoonSchema = z.object({
  id: z.number(),
  image: z.string(),
  questions: z.array(questionSchema).length(2),
});

export const cartoonsSchema = z.array(cartoonSchema).length(5);

export type Cartoon = z.infer<typeof cartoonSchema>;
export type Cartoons = z.infer<typeof cartoonsSchema>;
export type Question = z.infer<typeof questionSchema>;

export type QuestionResult = {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  cartoonId: number;
};

export type CartoonResult = {
  cartoon: Cartoon;
  questionResults: QuestionResult[];
};

export type Results = QuestionResult[];
