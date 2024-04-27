<script setup>
import {nextTick, ref, watch} from "vue";

import ProfileCard from "@/components/ProfileCard.vue";
import CategoriesList from "@/components/CategoriesList.vue";
import NavBar from "@/components/NavBar.vue";
import BlogList from "@/components/BlogList.vue";

import {useColors} from "vuestic-ui";
import FooterBar from "@/components/FooterBar.vue";
import {basic_info} from "@/assets/js/api.js";

const {currentPresetName} = useColors();

// Environment Values
const is_dev = ref(false);
const prefix = ref(is_dev.value ? "http://127.0.0.1:8080" : "");

// Basic Information
const name = ref(null);
const desi_name = ref(null);
const desi_page = ref(null);

// Values
const theme = ref(currentPresetName.value);
const category = ref(null);
const categoryRef = ref();
const blogListRef = ref();

watch(currentPresetName, (val) => {
  theme.value = val;
});

nextTick(() => {
  basic_info(prefix.value).then(r => {
    name.value = r.name;
    desi_name.value = r.desi_name;
    desi_page.value = r.desi_page;
  });

  watch(() => categoryRef.value.currentCategory, (val) => {
    category.value = val;
  }, {immediate: true, deep: false});
  watch(() => blogListRef.value.currentCategory, (val) => {
    category.value = val;
  }, {immediate: true, deep: false});
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
        <div class="mt-5 ml-5" style="max-width: 300px; min-width: 300px">
          <ProfileCard :theme="theme" :name="name"/>
          <CategoriesList :theme="theme" :category="category" ref="categoryRef"/>
        </div>
      </template>

      <template #right>
        <div class="mt-5 mr-5">
          <VaDatePicker
              v-model="date"
              readonly
              highlight-weekend
              weekends-color="info"
          />
        </div>
      </template>

      <template #content>
        <div class="mt-5 ml-5 mr-5">
          <BlogList :theme="theme" :category="category" ref="blogListRef"/>
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