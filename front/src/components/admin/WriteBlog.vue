<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
});
</script>

<template>
  <VaCard
      :outlined="theme === 'dark'"
      :bordered="theme !== 'dark'"
      class="mt-5 ml-5"
      style="width: calc(100% - 5rem); height: calc(100% - 5rem);">
    <VaCardTitle>Hello</VaCardTitle>
  </VaCard>
</template>

<style scoped>

</style>