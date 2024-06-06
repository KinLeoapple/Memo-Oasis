<script setup>
import {computed, nextTick, ref, watch} from "vue";

import ProfileCard from "@/components/home/ProfileCard.vue";
import CategoriesList from "@/components/home/CategoriesList.vue";
import NavBar from "@/components/common/NavBar.vue";
import BlogList from "@/components/home/BlogList.vue";

import {useColors} from "vuestic-ui";
import {get_blog_content} from "@/assets/js/api.js";
import RenderBlog from "@/components/home/RenderBlog.vue";
import {client_height} from "@/assets/js/client_size.js";
import BlogIndex from "@/components/home/BlogIndex.vue";
import Background from "@/components/common/Background.vue";
import BasicInfo from "@/components/common/BasicInfo.vue";
import {onBeforeRouteLeave} from 'vue-router';

const {currentPresetName} = useColors();

// Basic Information
const basicInfoRef = ref(null);
const name = ref(null);
const quote = ref(null);
const quote_name = ref(null);
const desi_name = ref(null);
const desi_page = ref(null);

// Values
const theme = ref(currentPresetName.value);
const category = ref(null);
const categoryRef = ref();
const blogListRef = ref();
const blogRenderRef = ref();
const blogId = ref(null);
const blogContent = ref(null);
const blogIndex = ref(null);
const maxTitle = ref(null);

watch(currentPresetName, (val) => {
  theme.value = val;
});

// Client height
const clientHeight = ref(0);
const height = computed({
  get() {
    return clientHeight.value;
  },
  set(value) {
    clientHeight.value = value;
  }
});

// Unwatch methods
let unwatchCat;
let unwatchBlog;
let unwatchRender;

nextTick(() => {
  // Get basic information, only watch once
  let basicInfo = basicInfoRef.value;
  watch(() =>
          [basicInfo.name, basicInfo.quote, basicInfo.quote_name, basicInfo.desi_name, basicInfo.desi_page],
      ([nameVal, quoteVal, quoteNameVal, desiNameVal, desiPageVal]) => {
        name.value = nameVal;
        quote.value = quoteVal;
        quote_name.value = quoteNameVal;
        desi_name.value = desiNameVal;
        desi_page.value = desiPageVal;
      });

  // Watch current category
  unwatchCat = watch(() => categoryRef.value.currentCategory, (val) => {
    if (val !== null) {
      category.value = val;
      document.documentElement.scrollTop = 0;
    }
  }, {immediate: true, deep: true});
  // Watch values in blog
  unwatchBlog = watch(() =>
      [
        blogListRef.value.currentCategory,
        blogListRef.value.currentBlog,
      ], ([categoryVal, blogVal]) => {
    category.value = categoryVal;
    blogId.value = blogVal;
    if (categoryVal !== null)
      document.documentElement.scrollTop = 0;
    (async () => {
      if (blogVal !== null && blogVal !== undefined)
        get_blog_content(blogId.value).then(r => {
          blogContent.value = r.content;
        });
    })();
  }, {immediate: true, deep: true});
  // Watch values in render
  unwatchRender = watch(() =>
      [
        blogRenderRef.value.currentContent,
        blogRenderRef.value.blogIndex,
        blogRenderRef.value.maxTitle
      ], ([contentVal, indexVal, maxTitleVal]) => {
    blogContent.value = contentVal;
    blogIndex.value = indexVal;
    maxTitle.value = maxTitleVal;
    if (contentVal === null) {
      blogId.value = null;
      blogListRef.value.currentBlog = null;
    }
  });

  height.value = client_height();
  window.onresize = () => {
    height.value = client_height();
  }
});

// Call unwatch methods before leave the page
onBeforeRouteLeave(() => {
  nextTick(() => {
    unwatchCat();
    unwatchBlog();
    unwatchRender();
    window.onresize = null;
  });
});
</script>

<template>
  <BasicInfo ref="basicInfoRef"/>
  <Background :theme="theme"/>
  <div>
    <VaLayout
        class="layout"
        :top="{fixed: true, order: 2}"
        :left="{fixed: true}"
        :right="{fixed: true}"
    >
      <template #top>
        <NavBar v-model:theme="theme"/>
      </template>

      <template #left>
        <div class="mt-5 ml-5 mb-5 left" :style="{height: `${height}px`,}">
          <ProfileCard :theme="theme" :name="name" :quote="quote" :quote-name="quote_name"/>
          <CategoriesList v-show="blogId === null" :theme="theme" :category="category" ref="categoryRef"/>
          <BlogIndex :theme="theme" :blog-index="blogIndex" :max-tag="maxTitle"/>
        </div>
      </template>

      <template #right>
        <div style="position: relative" class="mt-5 mr-5 right" :style="{height: `${height}px`,}">
          <VaDatePicker
              v-model="date"
              readonly
              highlight-weekend
              weekends-color="info"
          />
          <div style="position: absolute;width: 100%; height: 100%; margin-top: -110%"></div>
        </div>
      </template>

      <template #content>
        <div class="mt-5 ml-5 mr-5" :style="{minHeight: `${height}px`,}">
          <BlogList :theme="theme" :category="category" ref="blogListRef"/>
          <RenderBlog :theme="theme" :content="blogContent" ref="blogRenderRef"/>
        </div>
      </template>
    </VaLayout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>

<style>
.layout {
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
}

.left {
  max-width: 300px;
  min-width: 300px
}

@media screen and (max-width: 1024px) {
  .left {
    max-width: 200px;
    min-width: 200px
  }

  .right {
    display: none;
  }
}
</style>