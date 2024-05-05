<script setup>
import FeatherButton from "@/components/button/admin-side-button/FeatherButton.vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
});
</script>

<template>
  <div class="mt-5 ml-3">
    <FeatherButton/>
  </div>
</template>

<style scoped>

</style>