import z from 'zod';

export const questionSchema = z
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
  });
export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).length(10);
export type Questions = z.infer<typeof questionsSchema>;
