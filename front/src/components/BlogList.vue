<script setup>

import DeleteButton from "@/components/button/DeleteButton.vue";
import {ref, watch} from "vue";

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

const cleanCategory = () => {
  currentCategory.value = null;
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
  <div class="row">
    <div
        style="height: 100%; width: 100%; display: flex;"
        class="flex-direction-column md6 lg"
    >
      <transition name="fadeIn">
        <blockquote v-if="props.category !== null"
                    class="va-blockquote va-text-block mb-5">
          <VaNavbar
              style="padding: 0; background: transparent"
          >
            <template #left>
              <VaNavbarItem>
                <p style="display: flex; justify-content: start; align-items: center"
                   class="va-text-bold">
                  Category
                  <div class="dot"/>
                  <span class="va-text-success">{{ `${props.category}` }}</span>
                </p>
              </VaNavbarItem>
            </template>
            <template #right>
              <VaNavbarItem>
                <DeleteButton @click="cleanCategory"/>
              </VaNavbarItem>
            </template>
          </VaNavbar>
        </blockquote>
      </transition>

      <VaCard v-for="(record, index) in records"
              :key="index"
              class="mb-5 overflow-hidden pointer blog"
              :outlined="theme === 'dark'"
              :bordered="theme !== 'dark'"
      >
        <VaImage
            src="https://source.unsplash.com/1920x1080/?nature"
            style="height: 240px;"
        />
        <VaCardTitle
            style="font-size: 1.5rem">
          {{ record.title }}
        </VaCardTitle>
        <VaCardContent
            style="display: flex; flex-direction: column; gap: 1rem"
        >
          <blockquote
              class=""
              style="font-size: 1rem"
          >
            <p>{{ record.content }}</p>
          </blockquote>
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
            <div class="va-text-secondary va-text-justify blog-details">
              <p>{{ record.date }}</p>
              <div class="dot"></div>
              <span class="category" @click="changeCategory(record.category)">{{ record.category }}</span>
            </div>
            <div>
              <span class="va-link">Read more</span>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
  </div>

  <div>
    <VaPagination
        v-model="value"
        :visible-pages="7"
        :total="100"
        :page-size="5"
        boundary-numbers
        class="pb-5 justify-center sm:justify-start"
    >
    </VaPagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: [
        {
          title: "title",
          content: "Of all of the celestial bodies that capture our attention and fascination as\n" +
              "    astronomers, none has a greater influence on life on planet Earth than it’s\n" +
              "    own satellite, the moon. When you think about it.",
          date: "03/12/2024",
          category: "Life"
        },
        {
          title: "title",
          content: "A man can be destroyed but not defeated.",
          date: "03/12/2024",
          category: "Life"
        },
        {
          title: "title",
          content: "A man can be destroyed but not defeated.",
          date: "03/12/2024",
          category: "Life"
        },
        {
          title: "title",
          content: "A man can be destroyed but not defeated.",
          date: "03/12/2024",
          category: "Life"
        },
        {
          title: "title",
          content: "A man can be destroyed but not defeated.",
          date: "03/12/2024",
          category: "Life"
        }
      ],
      value: 3,
      pageSize: 10,
    };
  },
  methods: {
    async appendRecordsAsync() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.records.push({
        title: "title"
      });
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/common.css";

.blog {
  background-color: var(--va-text-block) !important;
}

.blog-details {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 0.9rem;
}

.category:hover {
  color: var(--va-link-color);
}

.fadeIn-enter-active {
  transition: all 0.3s linear;
  opacity: 0;
}

.fadeIn-enter-to {
  opacity: 100;
}
</style>