<script setup lang="ts">
import rawCartoons from '~/data/cartoons.json';
import { cartoonsSchema } from '~/types/cartoons';
import { useQuiz } from '~/composables/useQuiz';

const cartoons = cartoonsSchema.parse(rawCartoons);

const {
  // state
  currentIndex,
  userAnswer,
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
  resultsByCartoon,
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
              class="object-cover rounded-lg shadow-md"
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

    <div v-else class="flex flex-col items-center gap-y-4">
      <h2 class="text-2xl font-semibold">Results</h2>
      <div
        class="radial-progress text-2xl font-bold"
        :class="{
          'text-error': scoreCategory === 'Bad',
          'text-info': scoreCategory === 'Regular',
          'text-success': scoreCategory === 'Excellent',
          'text-accent': scoreCategory === 'Perfect',
        }"
        :style="`--value: ${scorePercentage}; --size: 12rem;`"
        :aria-valuenow="scorePercentage"
        role="progressbar"
      >
        <p>{{ scorePercentage }}%</p>
        <p>{{ scoreCategory }}</p>
      </div>
      <div class="space-y-6">
        <div
          v-for="cartoonResult in resultsByCartoon"
          :key="cartoonResult.cartoon.id"
          class="bg-base-200 rounded-lg p-6 space-y-4"
        >
          <div class="flex items-center gap-4">
            <img
              :src="cartoonResult.cartoon.image"
              :alt="`Cartoon ${cartoonResult.cartoon.id}`"
              class="w-16 h-16 object-cover rounded-lg shadow-sm"
            />
            <div>
              <h3 class="text-lg font-semibold">
                Cartoon {{ cartoonResult.cartoon.id }}
              </h3>
              <p class="text-sm text-gray-600">
                {{
                  cartoonResult.questionResults.filter((r) => r.isCorrect)
                    .length
                }}
                / {{ cartoonResult.questionResults.length }} correct
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="result in cartoonResult.questionResults"
              :key="result.question.id"
              class="bg-base-300 p-4 rounded space-y-2"
            >
              <p class="font-medium">{{ result.question.question }}</p>
              <div
                class="badge"
                :class="result.isCorrect ? 'badge-success' : 'badge-error'"
              >
                {{ result.isCorrect ? 'Correct' : 'Incorrect' }}
              </div>
              <p class="text-sm">
                <span class="text-gray-600">Your answer: </span>
                <span
                  :class="result.isCorrect ? 'text-green-600' : 'text-red-600'"
                  >{{ result.userAnswer }}</span
                >
              </p>
              <p v-if="!result.isCorrect" class="text-sm">
                <span class="text-gray-600">Correct answer: </span>
                <span class="text-green-600">{{ result.question.answer }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <button @click="initializeQuiz" class="btn btn-accent btn-wide">
        Restart
      </button>
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
