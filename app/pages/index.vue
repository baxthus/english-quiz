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
    <p>
      By
      <a class="link link-secondary" href="https://baxt.fun" target="_blank"
        >baxthus</a
      >
    </p>
  </div>
</template>
