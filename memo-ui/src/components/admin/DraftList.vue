<script setup>
import {ref} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
});

const draftList = ref([]);
</script>

<template>
<div>
  <VaCard>

  </VaCard>
</div>
</template>

<style scoped>

</style>