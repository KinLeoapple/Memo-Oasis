<script setup>
import {nextTick, ref, watch} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
  blogIndex: {
    type: Array,
    default: () => null
  },
  maxTag: {
    type: Number,
    default: 1
  }
});


const max = ref(props.maxTag);
const min = ref(6);

const findHeading = async (render, level) => {
  const levelHeading = props.blogIndex.filter(el => {
    return el.tag === level;
  });
  if (levelHeading.length === 0) {
    return;
  }
  render.querySelectorAll(`h${level}`).forEach((el, i) => {
    el.setAttribute("id", `blog-index-${levelHeading[i].id}`);
  });
};

nextTick(() => {
  watch(() => props.blogIndex, (index) => {
    if (index !== null && index.length > 0) {
      const render = document.querySelector("#render");
      for (let i = min.value; i >= max.value; i--)
        findHeading(render, i);
    }
  });
});
</script>

<template>
  <div v-if="props.blogIndex !== null && props.blogIndex.length > 0">
    <VaDivider class="mt-4 mb-3"/>
    <VaList>
      <VaListLabel
          style="font-size: 1rem; text-align: left"
          color="secondary"
      >
        <span style="font-size: x-large">I</span>ndex
      </VaListLabel>

      <VaScrollContainer
          style="max-height: 150px"
          color="primary"
          vertical
      >
        <VaListItem
            v-for="(item, index) in blogIndex"
            :key="index"
            :href="`#blog-index-${item.id}`"
            :style="{marginLeft: `${((item.tag - maxTag) * 10)}px`}"
            class="list pointer"
            :class="{
          'list-dark-bg': props.theme === 'dark',
          'list-light-bg': props.theme === 'light',
          'list-light': props.theme === 'light',
        }"
        >
          <VaListSeparator spaced/>
          <VaListItemSection class="ml-3">
            <VaListItemLabel
                :lines="2"
                caption
                class="va-text-bold list-text"
                style="font-size: 0.9rem;">
              {{ item.text }}
            </VaListItemLabel>
          </VaListItemSection>
        </VaListItem>
      </VaScrollContainer>
    </VaList>
  </div>
</template>

<style scoped>
@import "@/assets/css/common.css";
</style>