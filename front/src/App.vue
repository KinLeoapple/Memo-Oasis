<script setup>
import {computed, nextTick, ref, watch} from "vue";

import ProfileCard from "@/components/ProfileCard.vue";
import CategoriesList from "@/components/CategoriesList.vue";
import NavBar from "@/components/NavBar.vue";
import BlogList from "@/components/BlogList.vue";

import {useColors} from "vuestic-ui";
import FooterBar from "@/components/FooterBar.vue";
import {basic_info, get_blog_content} from "@/assets/js/api.js";
import RenderBlog from "@/components/RenderBlog.vue";
import {client_height} from "@/assets/js/client_size.js";

const {currentPresetName} = useColors();

// Environment Values
const is_dev = ref(false); // Remember to set to false before build
const prefix = ref(is_dev.value ? "http://127.0.0.1:8080" : "");

// Basic Information
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
nextTick(() => {
  basic_info(prefix.value).then(r => {
    name.value = r.name;
    desi_name.value = r.desi_name;
    desi_page.value = r.desi_page;
    quote.value = r.quote;
    quote_name.value = r.quote_name;
  });

  watch(() => categoryRef.value.currentCategory, (val) => {
    category.value = val;
  }, {immediate: true, deep: false});
  watch(() =>
      [
        blogListRef.value.currentCategory,
        blogListRef.value.currentBlog,
      ], ([categoryVal, blogVal]) => {
    category.value = categoryVal;
    blogId.value = blogVal;
    (async () => {
      if (blogVal !== null)
        get_blog_content(0, prefix.value).then(r => {
          blogContent.value = r.content;
          console.log(blogContent.value)
        });
    })();
  }, {immediate: true, deep: false});
  watch(() => blogRenderRef.value.currentContent, (val) => {
    blogContent.value = val;
    if (val === null) {
      blogId.value = null;
      blogListRef.value.currentBlog = null;
    }
  });

  height.value = client_height();
  window.addEventListener('resize', () => {
    height.value = client_height();
  });
});
</script>

<template>
  <div class="background"></div>
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
        <div class="mt-5 ml-5" style="max-width: 300px; min-width: 300px" :style="{height: `${height}px`,}">
          <ProfileCard :theme="theme" :name="name" :quote="quote" :quote-name="quote_name"/>
          <CategoriesList :theme="theme" :category="category" ref="categoryRef"/>
        </div>
      </template>

      <template #right>
        <div style="position: relative" class="mt-5 mr-5" :style="{height: `${height}px`,}">
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
  <FooterBar :theme="theme" :name="desi_name" :page="desi_page"/>
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
html, body, #app {
  width: 100%;
  height: 100%;
}

.background {
  --background-blur: 5px;
  -webkit-filter: blur(var(--background-blur)); /* Chrome, Opera */
  -moz-filter: blur(var(--background-blur));
  -ms-filter: blur(var(--background-blur));
  filter: blur(var(--background-blur));
  position: fixed;
  width: 105%;
  height: 105%;
  /* Add your background pattern here */
  /* background-color: lightblue; */
  background-image: radial-gradient(var(--va-background-primary) 55%, #0000),
    /* radial-gradient(black 55%, #0000), */ linear-gradient(
      135deg,
      red,
      orange,
      yellow,
      lime,
      cyan,
      blue,
      indigo,
      deeppink
  );
  background-size: 100% 0.5%, contain;
  background-blend-mode: hard-light;
  margin-left: -2.5% !important;
  margin-top: 2.5% !important;
  /* background-position: 0 0, 1em 1em, 0 0; */
}

.layout {
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
}
</style>