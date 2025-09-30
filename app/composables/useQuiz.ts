import type {
  CartoonResult,
  Cartoons,
  Question,
  Results,
} from '~/types/cartoons';

type EnhancedQuestion = Question & { cartoonImage: string; cartoonId: number };
type ScoreCategory = 'Perfect' | 'Excellent' | 'Regular' | 'Bad';

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

export const useQuiz = (cartoons: Cartoons) => {
  const currentIndex = ref(0);
  const userAnswer = ref<string | null>(null);
  const results = ref<Results>([]);
  const isFinished = ref(false);
  const score = ref(0);
  const shuffledQuestions = ref<EnhancedQuestion[]>([]);

  const initializeQuiz = () => {
    const allQuestions: EnhancedQuestion[] = [];

    shuffle(cartoons).forEach((cartoon) => {
      shuffle(cartoon.questions).forEach((question, i) => {
        allQuestions.push({
          id: i + 1,
          question: question.question,
          answer: question.answer,
          options: shuffle(question.options),
          cartoonImage: cartoon.image,
          cartoonId: cartoon.id,
        });
      });
    });

    shuffledQuestions.value = allQuestions;
    currentIndex.value = 0;
    userAnswer.value = null;
    results.value = [];
    isFinished.value = false;
    score.value = 0;
  };

  const currentQuestion = computed(
    () => shuffledQuestions.value[currentIndex.value] ?? null,
  );
  const currentCartoonImage = computed(
    () => currentQuestion.value?.cartoonImage ?? null,
  );
  const isLastQuestion = computed(
    () => currentIndex.value === shuffledQuestions.value.length - 1,
  );
  const totalQuestions = computed(() => shuffledQuestions.value.length);
  const radioGroupName = computed(() => `q-${currentIndex.value}`);
  const canProceed = computed(() => !!userAnswer.value);
  const scorePercentage = computed(() =>
    totalQuestions.value
      ? Math.round((score.value / totalQuestions.value) * 100)
      : 0,
  );

  const scoreCategory = computed<ScoreCategory>(() => {
    const p = scorePercentage.value;
    return p === 100
      ? 'Perfect'
      : p >= 80
        ? 'Excellent'
        : p >= 50
          ? 'Regular'
          : 'Bad';
  });

  const nextQuestion = () => {
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

    if (isCorrect) score.value++;

    if (currentIndex.value < shuffledQuestions.value.length - 1) {
      currentIndex.value++;
      userAnswer.value = null;
    } else {
      isFinished.value = true;
    }
  };

  const resultsByCartoon = computed<CartoonResult[]>(() => {
    const cartoonMap = new Map<number, CartoonResult>();

    results.value.forEach((result) => {
      if (!cartoonMap.has(result.cartoonId)) {
        const cartoon = cartoons.find((c) => c.id === result.cartoonId);
        if (cartoon)
          cartoonMap.set(result.cartoonId, { cartoon, questionResults: [] });
      }
      cartoonMap.get(result.cartoonId)?.questionResults.push(result);
    });

    return Array.from(cartoonMap.values()).sort(
      (a, b) => a.cartoon.id - b.cartoon.id,
    );
  });

  return {
    currentIndex,
    userAnswer,
    isFinished,
    currentQuestion,
    currentCartoonImage,
    isLastQuestion,
    totalQuestions,
    radioGroupName,
    canProceed,
    scorePercentage,
    scoreCategory,
    resultsByCartoon,
    initializeQuiz,
    nextQuestion,
  };
};
