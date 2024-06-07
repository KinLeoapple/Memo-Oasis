<script setup>
import img from "@/assets/img/img.webp";
import {nextTick, ref, watch} from "vue";
import GoBackButton from "@/components/button/GoBackButton.vue";
import {get_blog, get_blog_all, get_draft_all} from "@/assets/js/api.js";
import {to_date} from "@/assets/js/to_date.js";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
  category: {
    type: String,
    default: () => null
  },
});

const blogList = ref([]);
const currentList = ref([]);
const currentPage = ref(0);
const pageSize = ref(10);
const currentCategory = ref(null);
const changeCategory = (name) => {
  if (currentCategory.value !== name)
    currentCategory.value = name;
}

const cleanCategory = () => {
  currentCategory.value = null;
}

const currentBlog = ref(null);
const changeBlog = (id) => {
  if (currentBlog.value !== id)
    currentBlog.value = id;
}

watch(() => props.category, (val) => {
  if (val !== null) {
    currentCategory.value = val;
    currentList.value = blogList.value.filter(item => {
        return item.category === currentCategory.value;
    });
  }
  else {
    currentCategory.value = null;
    currentList.value = blogList.value;
  }
});

nextTick(() => {
  get_blog_all().then(r => {
    if (r !== null) {
      for (let i in r) {
        get_blog(r[i].id).then(b => {
          blogList.value.push(b);
          currentList.value.push(b);
        });
      }
    }
  });
});

defineExpose({currentCategory, currentBlog});
</script>

<template>
  <div class="row" v-show="currentBlog === null">
    <div
        style="min-height: 100%; width: 100%; display: flex;"
        class="flex-direction-column md-6 lg"
    >
      <transition name="fadeIn">
        <VaCard v-if="props.category !== null"
                class="mb-5 cat container"
                :outlined="theme === 'dark'"
                :bordered="theme !== 'dark'"
        >
          <VaNavbar
              class="pt-3 pl-3 pr-3 pb-3"
              style="padding: 0; background: transparent !important;"
          >
            <template #left>
              <VaNavbarItem>
                <p style=""
                   class="va-text-bold va-h6">
                  <span style="font-size: 1.8rem">C</span>ategory
                  <VaDivider/>
                  <span class="text" style="font-size: 1.15rem">{{ `${props.category}` }}</span>
                </p>
              </VaNavbarItem>
            </template>
            <template #right>
              <VaNavbarItem>
                <GoBackButton style="background: var(--va-primary)" :shadowed="theme === 'dark'"
                              @click="cleanCategory"/>
              </VaNavbarItem>
            </template>
          </VaNavbar>
        </VaCard>
      </transition>

      <div v-for="(blog, index) in currentList.sort((a, b) => {
        return Number(b.date) - Number(a.date);
      }).filter(item => {
        if (currentCategory !== null)
          return item.category === currentCategory
         else
           return true
      })" :key="index">
        <VaCard
            class="mb-5 overflow-hidden blog"
            :outlined="theme === 'dark'"
            :bordered="theme !== 'dark'"
            @click="changeBlog(blog.id)"
        >
          <div class="overflow-hidden blog-img">
            <VaImage
                style="height: 100%"
                fit="cover"
                lazy
                :src="img"
            />
          </div>
          <VaCardTitle
              style="font-size: 1.5rem">
            {{ blog.title }}
          </VaCardTitle>
          <VaCardContent
              style="display: flex; flex-direction: column; gap: 1rem"
          >
            <blockquote
                style="font-size: 1rem"
            >
              <p>{{ blog.desc }}</p>
            </blockquote>
            <div :class="{'more-info': theme === 'dark',
            'more-info-light': theme === 'light'}">
              <div class="va-text-secondary va-text-justify"
                   :class="{'blog-details': theme === 'dark',
                'blog-details-light': theme === 'light'}"
              >
                <p>{{ to_date(blog.date) }}</p>
                <div class="dot" :class="{'dot-light-background': theme === 'light'}"></div>
                <span class="category pointer" @click.stop="changeCategory(blog.category)">{{
                    blog.category
                  }}</span>
              </div>
            </div>
          </VaCardContent>
        </VaCard>
      </div>
    </div>
  </div>

  <div v-show="currentBlog === null && currentList.length > pageSize">
    <VaPagination
        v-model="currentPage"
        :visible-pages="7"
        :total="currentList.length"
        :page-size="pageSize"
        boundary-numbers
        class="pb-5 justify-center sm:justify-start"
    >
    </VaPagination>
  </div>
</template>

<style scoped>
@import "@/assets/css/common.css";

.dot-light-background {
  background: var(--va-text-primary) !important;
}

.cat {
  border-radius: var(--va-card-border-radius) !important;
  background-color: var(--va-text-block) !important;
}

.cat .text {
  backdrop-filter: blur(10px) !important;
  background-color: var(--va-success) !important;
  padding: 0 10px;
  border-radius: 9999px !important;
  color: var(--va-text-primary) !important;
}

.blog {
  backdrop-filter: blur(30px) !important;
  background-color: rgba(131, 131, 145, 0.06) !important;
  transition: background-color .2s ease, backdrop-filter .2s ease !important;
  cursor: pointer;
}

.blog:hover {
  backdrop-filter: blur(10px) !important;
  background-color: rgb(131 131 145 / 24%) !important;
}

.more-info {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
}

.more-info-light {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
}

.blog-details {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 0.94rem;
  border-radius: 999px;
  background-color: rgb(131 131 145 / 14%);
  padding: 6px 12px;
  margin-top: 10px;
}

.blog-details-light {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 0.94rem;
  border-radius: 999px;
  background-color: rgba(31, 31, 31, 0.14);
  padding: 6px 12px;
  margin-top: 10px;
  color: var(--va-text-primary) !important;
}

.blog-img {
  border-radius: 10px;
  height: 240px;
  margin: 10px;
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

.container {
  width: 100%;
  height: 100%;
  background: lightblue;
  position: relative;
  overflow: hidden;
}

.container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, #3498db 10%, transparent 20%),
  radial-gradient(circle, transparent 10%, var(--va-text-block) 20%);
  background-size: 30px 30px;
  animation: moveBackground 32s linear infinite;
}

@keyframes moveBackground {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20%, 20%);
  }
  100% {
    transform: translate(0, 0);
  }
}

</style>