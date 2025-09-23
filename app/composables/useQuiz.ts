import type { Cartoons, Question, Cartoon } from '~/types/cartoons';
import type { Results, QuestionResult, CartoonResult } from '~/types/results';

export type EnhancedQuestion = Question & {
  cartoonImage: string;
  cartoonId: number;
};

export type ScoreCategory = 'Perfect' | 'Excellent' | 'Regular' | 'Bad';

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export function useQuiz(cartoons: Cartoons) {
  const currentIndex = ref(0);
  const userAnswer = ref<string | null>(null);
  const results = ref<Results>([]);
  const isFinished = ref(false);
  const score = ref(0);

  const shuffledQuestions = ref<EnhancedQuestion[]>([]);

  function initializeQuiz(): void {
    const shuffledCartoons = shuffle([...cartoons]);
    const allQuestions: EnhancedQuestion[] = [];

    for (const cartoon of shuffledCartoons) {
      for (const question of cartoon.questions) {
        const enhancedQuestion: EnhancedQuestion = {
          ...question,
          options: shuffle([...question.options]),
          cartoonImage: cartoon.image,
          cartoonId: cartoon.id,
        };
        allQuestions.push(enhancedQuestion);
      }
    }

    shuffledQuestions.value = shuffle(allQuestions);
    currentIndex.value = 0;
    userAnswer.value = null;
    results.value = [];
    isFinished.value = false;
    score.value = 0;
  }

  const currentQuestion = computed<EnhancedQuestion | null>(
    () => shuffledQuestions.value[currentIndex.value] ?? null,
  );

  const currentCartoonImage = computed<string | null>(
    () => shuffledQuestions.value[currentIndex.value]?.cartoonImage ?? null,
  );

  const isLastQuestion = computed<boolean>(() => {
    if (!currentQuestion.value) return false;
    return currentIndex.value === shuffledQuestions.value.length - 1;
  });

  const totalQuestions = computed<number>(() => shuffledQuestions.value.length);

  const radioGroupName = computed<string>(() => `q-${currentIndex.value}`);

  const canProceed = computed<boolean>(() => !!userAnswer.value);

  function finishQuiz(): void {
    isFinished.value = true;
  }

  function nextQuestion(): void {
    const question = currentQuestion.value;
    const answer = userAnswer.value;

    if (!question || !answer) return;

    const isCorrect = question.answer === answer;

    results.value.push({
      question: {
        id: question.id,
        question: question.question,
        options: question.options,
        answer: question.answer,
      },
      userAnswer: answer,
      isCorrect,
      cartoonId: question.cartoonId,
    });

    if (isCorrect) {
      score.value += 1;
    }

    if (currentIndex.value < shuffledQuestions.value.length - 1) {
      currentIndex.value += 1;
      userAnswer.value = null;
    } else {
      finishQuiz();
    }
  }

  const scorePercentage = computed<number>(() => {
    if (totalQuestions.value === 0) return 0;
    return Math.round((score.value / totalQuestions.value) * 100);
  });

  const scoreCategory = computed<ScoreCategory>(() => {
    const percentage = scorePercentage.value;
    if (percentage === 100) return 'Perfect';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 50) return 'Regular';
    return 'Bad';
  });

  const resultsByCartoon = computed<CartoonResult[]>(() => {
    const cartoonMap = new Map<number, CartoonResult>();

    for (const result of results.value) {
      const cartoonId = result.cartoonId;

      if (!cartoonMap.has(cartoonId)) {
        // Find the cartoon data
        const cartoon = cartoons.find((c) => c.id === cartoonId);
        if (cartoon) {
          cartoonMap.set(cartoonId, {
            cartoon,
            questionResults: [],
          });
        }
      }

      const cartoonResult = cartoonMap.get(cartoonId);
      if (cartoonResult) {
        cartoonResult.questionResults.push(result);
      }
    }

    return Array.from(cartoonMap.values());
  });

  return {
    // state
    currentIndex,
    userAnswer,
    results,
    isFinished,
    score,
    // derived
    currentQuestion,
    currentCartoonImage,
    isLastQuestion,
    totalQuestions,
    radioGroupName,
    canProceed,
    scorePercentage,
    scoreCategory,
    resultsByCartoon,
    // actions
    initializeQuiz,
    nextQuestion,
    finishQuiz,
  };
}
