<script setup>
import {ref, watch, nextTick} from "vue";
import {get_category, get_category_all, get_category_number} from "@/assets/js/api.js";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
  category: {
    type: String,
    default: () => null
  }
});

const categories = ref([]);
const currentCategory = ref(null);

const changeCategory = (name) => {
  if (currentCategory.value !== name)
    currentCategory.value = name;
}

nextTick(() => {
  get_category_all().then(r => {
    if (r !== null) {
      for (let i in r) {
        Promise.all([get_category(r[i].id), get_category_number(r[i].id)]).then(arr => {
          if (arr[1].count > 0) {
            arr[0].number = arr[1].count;
            categories.value.push(arr[0]);
          }
        });
      }
    }
  });
});

defineExpose({currentCategory});

watch(() => props.category, (val) => {
  if (val !== null)
    currentCategory.value = val;
  else
    currentCategory.value = null;
});
</script>

<template>
  <div v-if="categories.length > 0">
    <VaDivider class="mt-4 mb-3"/>
    <VaList>
      <VaListLabel
          style="font-size: 1rem; text-align: left"
          color="secondary"
      >
        <span style="font-size: x-large">C</span>ategory
      </VaListLabel>

      <VaScrollContainer
          style="max-height: 150px"
          color="secondary"
          vertical
      >
        <VaListItem
            v-for="(category, index) in categories.sort((a, b) => {
              return a.catName.toLowerCase()
              .localeCompare(b.catName.toLowerCase());
            })"
            :key="index"
            @click="changeCategory(category.catName)"
            class="list pointer"
            :class="{
              'list-dark-bg': props.theme === 'dark',
              'list-light-bg': props.theme === 'light',
              'list-light': props.theme === 'light',
            }"
            v-show="category.number > 0"
        >
          <VaListSeparator spaced/>
          <VaListItemSection class="ml-3">
            <VaListItemLabel
                caption
                class="va-text-bold list-text"
                style="font-size: 0.9rem;">
              {{ category.catName }}
            </VaListItemLabel>
          </VaListItemSection>

          <VaListItemSection
              style="display: flex;"
              class="mr-3 flex-direction-column align-end justify-center"
          >
            <VaBadge
                color="info"
                :text="category.number"
                style="--va-badge-text-wrapper-border-radius: 40px;"
            />
          </VaListItemSection>
        </VaListItem>
      </VaScrollContainer>
    </VaList>
  </div>
</template>

<style scoped>
@import "@/assets/css/common.css";
</style>