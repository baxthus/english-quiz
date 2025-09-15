<script setup lang="ts">
definePageMeta({
  layout: 'main',
});
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <img
      src="~/assets/azumanga-daioh-osaka.gif"
      alt="Azumanga Daioh Osaka"
      class="w-48 h-48"
    />
    <h1 class="text-4xl font-bold">English Quiz</h1>
    <button @click="() => navigateTo('/quiz')" class="btn btn-accent btn-lg">
      Start Quiz
    </button>
    <div class="text-center opacity-70">
      <p>
        by
        <a
          class="link link-secondary"
          href="https://github.com/baxthus"
          target="_blank"
          >baxthus</a
        >
        and
        <a
          class="link link-secondary"
          href="https://github.com/guerrei28"
          target="_blank"
          >guerrei</a
        >
      </p>
      <a
        class="link link-secondary"
        href="https://github.com/baxthus/english-quiz"
        target="_blank"
        >source code</a
      >
    </div>
  </div>
</template>
