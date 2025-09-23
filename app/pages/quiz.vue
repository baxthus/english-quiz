<script setup lang="ts">
import rawCartoons from '~/data/questions.json';
import { cartoonsSchema } from '~/types/cartoons';
import { useQuiz } from '~/composables/useQuiz';

const cartoons = cartoonsSchema.parse(rawCartoons);

const {
  // state
  currentIndex,
  userAnswer,
  results,
  isFinished,
  // derived
  currentQuestion,
  currentCartoonImage,
  isLastQuestion,
  totalQuestions,
  radioGroupName,
  canProceed,
  scorePercentage,
  scoreCategory,
  // actions
  initializeQuiz,
  nextQuestion,
} = useQuiz(cartoons);

onMounted(() => initializeQuiz());
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-4xl font-bold">Quiz</h1>

    <div v-if="!isFinished" class="sm:w-96 space-y-2">
      <progress
        class="progress progress-secondary w-full"
        :value="currentIndex"
        :max="totalQuestions - 1"
      />
      <transition name="fade-slide" mode="out-in">
        <div v-if="currentQuestion" :key="currentIndex" class="space-y-4">
          <div v-if="currentCartoonImage" class="flex justify-center">
            <img
              :src="currentCartoonImage"
              :alt="`Cartoon for question ${currentQuestion.id}`"
              class="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <p class="text-xl">{{ currentQuestion.question }}</p>
          <ul class="space-y-2">
            <li
              v-for="(option, i) in currentQuestion.options"
              :key="`${currentIndex}-${i}-${option}`"
            >
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  :value="option"
                  v-model="userAnswer"
                  :name="radioGroupName"
                  class="radio"
                />
                <span>{{ option }}</span>
              </label>
            </li>
          </ul>
          <button
            @click="nextQuestion"
            :disabled="!canProceed"
            class="btn btn-primary"
          >
            {{ isLastQuestion ? 'Finish' : 'Next' }}
          </button>
        </div>
      </transition>
    </div>

    <div v-else class="space-y-4">
      <h2 class="text-2xl font-semibold">Results</h2>
      <div
        class="radial-progress"
        :class="{
          'text-error': scoreCategory === 'Bad',
          'text-info': scoreCategory === 'Regular',
          'text-success': scoreCategory === 'Excellent',
          'text-accent': scoreCategory === 'Perfect',
        }"
        :style="`--value: ${scorePercentage};`"
        :aria-valuenow="scorePercentage"
        role="progressbar"
      >
        {{ scorePercentage }}%
      </div>
      <ul class="space-y-4">
        <li
          v-for="(r, i) in results"
          :key="i"
          class="border p-4 rounded space-y-2"
        >
          <p class="font-medium">{{ i + 1 }}. {{ r.question.question }}</p>
          <p>Your answer: {{ r.userAnswer }}</p>
          <p v-if="!r.isCorrect">Correct answer: {{ r.question.answer }}</p>
          <div
            class="badge"
            :class="r.isCorrect ? 'badge-success' : 'badge-error'"
          >
            {{ r.isCorrect ? 'Correct' : 'Incorrect' }}
          </div>
        </li>
      </ul>
      <div>
        <button @click="initializeQuiz" class="btn btn-accent">Restart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 300ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
