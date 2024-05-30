<script setup>
const props = defineProps({
  shadowed: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <button class="button" :class="{'shadow': shadowed}">

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
    </svg>

    <div class="text va-text-bold">
      More
    </div>

  </button>
</template>

<style scoped>
@import "@/assets/css/go-button.css";
@import "@/assets/css/go-button-shadow.css";
</style>