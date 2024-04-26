<script setup>
import {computed, ref, watch} from "vue";

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

const currentCategory = ref(null);
const changeCategory = (name) => {
  if (currentCategory.value !== name)
    currentCategory.value = name;
}

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
          color="primary"
          vertical
      >
        <VaListItem
            v-for="(category, index) in categories"
            :key="index"
            @click="changeCategory(category.name)"
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
                caption
                class="va-text-bold list-text"
                style="font-size: 0.9rem;">
              {{ category.name }}
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

<script>
export default {
  data() {
    return {
      categories: [
        {
          name: "Tech",
          number: 10
        },
        {
          name: "Life",
          number: 2
        },
        {
          name: "Java",
          number: 12
        },
      ],
    };
  },
};
</script>

<style scoped>
.list {
  --list-text: var(--va-on-background-primary);
  border-radius: 0.25rem;
}

.list-light:hover {
  --list-text: #FFFFFF;
}

.list-dark-bg:hover {
  background: #3472F0;
}

.list-light-bg:hover {
  background: #154EC1;
}

.list-text {
  color: var(--list-text) !important;
}
</style>