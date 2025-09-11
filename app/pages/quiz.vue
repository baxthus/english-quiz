<script setup lang="ts">
import rawQuestions from '~/data/questions.json';
import { questionsSchema } from '~/types/questions';
import type { Results } from '~/types/results';

const questions = questionsSchema.parse(rawQuestions);

const currentIndex = ref(0);
const currentQuestion = computed(() => questions[currentIndex.value] ?? null);
const userAnswer = ref<string | null>(null);
const results = ref<Results>([]);
const isFinished = ref(false);

const finishQuiz = () => (isFinished.value = true);

function nextQuestion() {
  if (!currentQuestion.value || !userAnswer.value) return;

  results.value.push({
    question: currentQuestion.value,
    userAnswer: userAnswer.value,
    isCorrect: currentQuestion.value.answer === userAnswer.value,
  });

  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++;
    userAnswer.value = null;
  } else finishQuiz();
}

const isLastQuestion = computed(() => {
  if (!currentQuestion.value) return false;
  return currentIndex.value === questions.length - 1;
});

const score = computed(() => results.value.filter((r) => r.isCorrect).length);
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-4xl font-bold">Quiz</h1>

    <div v-if="!isFinished">
      <div v-if="currentQuestion" class="space-y-4">
        <p class="text-xl">{{ currentQuestion.question }}</p>
        <ul class="space-y-2">
          <li v-for="option in currentQuestion.options" :key="option">
            <label class="inline-flex items-center gap-2">
              <input
                type="radio"
                :value="option"
                v-model="userAnswer"
                name="answer"
                class="radio"
              />
              <span>{{ option }}</span>
            </label>
          </li>
        </ul>
        <button
          @click="nextQuestion"
          :disabled="!userAnswer"
          class="btn btn-primary"
        >
          {{ isLastQuestion ? 'Finish' : 'Next' }}
        </button>
      </div>
      <div v-else>
        <p>No questions available</p>
      </div>
    </div>

    <div v-else class="space-y-4">
      <h2 class="text-2xl font-semibold">Results</h2>
      <p>Score: {{ score }} / {{ questions.length }}</p>
      <ul class="space-y-2">
        <li v-for="(r, i) in results" :key="i" class="border p-4 rounded">
          <p class="font-medium">{{ i + 1 }}. {{ r.question.question }}</p>
          <p>Your answer: {{ r.userAnswer }}</p>
          <p v-if="!r.isCorrect">Correct answer: {{ r.question.answer }}</p>
          <p :class="r.isCorrect ? 'text-green-600' : 'text-red-600'">
            {{ r.isCorrect ? 'Correct' : 'Incorrect' }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
