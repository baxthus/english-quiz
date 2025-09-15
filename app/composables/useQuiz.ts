import type { Question } from '~/types/questions';
import type { Results } from '~/types/results';

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

export function useQuiz(questions: Question[]) {
  const currentIndex = ref(0);
  const userAnswer = ref<string | null>(null);
  const results = ref<Results>([]);
  const isFinished = ref(false);

  const score = ref(0);

  const shuffledQuestions = ref<Question[]>([]);

  function initializeQuiz() {
    const withShuffledOptions = questions.map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));
    shuffledQuestions.value = shuffle(withShuffledOptions);

    currentIndex.value = 0;
    userAnswer.value = null;
    results.value = [];
    isFinished.value = false;
    score.value = 0;
  }

  const currentQuestion = computed(
    () => shuffledQuestions.value[currentIndex.value] ?? null,
  );

  const isLastQuestion = computed(() => {
    if (!currentQuestion.value) return false;
    return currentIndex.value === shuffledQuestions.value.length - 1;
  });

  const totalQuestions = computed(() => shuffledQuestions.value.length);

  const radioGroupName = computed(() => `q-${currentIndex.value}`);

  const canProceed = computed(() => !!userAnswer.value);

  function finishQuiz() {
    isFinished.value = true;
  }

  function nextQuestion() {
    if (!currentQuestion.value || !userAnswer.value) return;

    const correct = currentQuestion.value.answer === userAnswer.value;
    results.value.push({
      question: currentQuestion.value,
      userAnswer: userAnswer.value,
      isCorrect: correct,
    });

    if (correct) score.value += 1;

    if (currentIndex.value < shuffledQuestions.value.length - 1) {
      currentIndex.value += 1;
      userAnswer.value = null;
    } else finishQuiz();
  }

  const scorePercentage = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return (score.value / totalQuestions.value) * 100;
  });

  // 100% - Perfect
  // 90-80% - Excellent
  // 70-50% - Regular
  // >50% - Bad
  const scoreCategory = computed(() => {
    const percentage = scorePercentage.value;
    if (percentage === 100) return 'Perfect';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 50) return 'Regular';
    return 'Bad';
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
    isLastQuestion,
    totalQuestions,
    radioGroupName,
    canProceed,
    scorePercentage,
    scoreCategory,
    // actions
    initializeQuiz,
    nextQuestion,
    finishQuiz,
  };
}
