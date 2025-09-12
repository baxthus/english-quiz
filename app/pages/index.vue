<script setup lang="ts">
definePageMeta({
  layout: 'main',
});
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <img
      src="~/assets/azumanga-daioh-osaka.gif"
      alt="Azumanga Daioh Osaka"
      class="w-48 h-48"
    />
    <h1 class="text-2xl font-bold">English Quiz</h1>
    <button @click="() => navigateTo('/quiz')" class="btn btn-accent">
      Start Quiz
    </button>
    <p>
      By
      <a class="link link-secondary" href="https://baxt.fun" target="_blank"
        >baxthus</a
      >
    </p>
  </div>
</template>
