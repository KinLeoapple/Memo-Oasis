<script setup>
import BlogWriter from "@/components/admin/BlogWriter.vue";
import {ref} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
  name: {
    type: String,
  },
  pass: {
    type: String,
  }
});

const title = ref("");
</script>

<template>
  <VaCard
      :outlined="theme === 'dark'"
      :bordered="theme !== 'dark'"
      class="mt-5 ml-5"
      style="width: calc(100% - 5rem); height: calc(100% - 5rem);">
    <VaCardTitle>Hello</VaCardTitle>
    <VaDivider/>
    <VaCardContent style="display:flex; width: 100%; height: calc(100% - 5rem); padding: 0">
        <BlogWriter :theme="theme" :name="name" :pass="pass" :title="title"/>
    </VaCardContent>
  </VaCard>
</template>

<style scoped>

</style>