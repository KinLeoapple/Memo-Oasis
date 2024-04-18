<script setup>
import {ref, watch} from "vue";

import ProfileCard from "@/components/ProfileCard.vue";
import CategoriesList from "@/components/CategoriesList.vue";
import NavBar from "@/components/NavBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import BlogList from "@/components/BlogList.vue";

import {useColors} from "vuestic-ui";

const {currentPresetName} = useColors();

const theme = ref(currentPresetName.value);

watch(currentPresetName, (val) => {
  theme.value = val;
});
</script>

<template>
  <VaLayout class="layout">
    <template #top>
      <NavBar v-model:theme="theme"/>
    </template>

    <template #left>
      <div class="mt-5 ml-5" style="max-width: 300px; min-width: 300px">
        <ProfileCard :theme="theme"/>
        <CategoriesList :theme="theme"/>
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
      <div class="mt-5">
<!--        <BlogList/>-->
      </div>
    </template>

    <template #bottom>
      <FooterBar/>
    </template>
  </VaLayout>
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

.layout {
  min-width: 100%;
  min-height: 100%;
}
</style>