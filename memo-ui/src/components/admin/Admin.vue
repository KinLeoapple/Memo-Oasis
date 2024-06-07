<script setup>

import Background from "@/components/common/Background.vue";
import NavBar from "@/components/common/NavBar.vue";
import {computed, nextTick, ref, watch} from "vue";
import {useColors} from "vuestic-ui";
import BasicInfo from "@/components/common/BasicInfo.vue";
import {client_height} from "@/assets/js/client_size.js";
import LoginCard from "@/components/admin/LoginCard.vue";
import {onBeforeRouteLeave} from "vue-router";
import SideBar from "@/components/admin/SideBar.vue";
import WriteBlog from "@/components/admin/WriteBlog.vue";
import BlogOrDraftList from "@/components/admin/BlogOrDraftList.vue";

const {currentPresetName} = useColors();

// Basic Information
const basicInfoRef = ref(null);
const name = ref(null);
const quote = ref(null);
const quote_name = ref(null);
const desi_name = ref(null);
const desi_page = ref(null);

// Values
const fixedHeight = ref(true);
const theme = ref(currentPresetName.value);
const loginCardRef = ref(null);
const login = ref(false);
const blogOrDraftListRef = ref(null);
const blogId = ref(null);
const writeBlogRef = ref(null);
const blogPosted = ref(null);

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
let unwatchLoginCard;
let unwatchWriteBlog;
let unwatchBlogOrDraftList;

nextTick(() => {
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

  // Watch login state
  unwatchLoginCard = watch(() =>
          loginCardRef.value.isLogin,
      (loginVal) => {
        login.value = loginVal;
        if (loginVal) {
          fixedHeight.value = false;
          unwatchLoginCard();
        }
      }, {immediate: true, deep: true});

  // Watch write blog state
  unwatchWriteBlog = watch(() => {
        if (writeBlogRef.value != null) {
          fixedHeight.value = true;
          return writeBlogRef.value.afterPost;
        } else {
          return true;
        }
      },
      (afterPostVal) => {
        blogPosted.value = afterPostVal;
        if (afterPostVal)
          blogId.value = null;
      }, {immediate: true, deep: true});

  // Watch list state
  unwatchBlogOrDraftList = watch(() => {
        if (blogOrDraftListRef.value != null) {
          fixedHeight.value = false;
          return blogOrDraftListRef.value.currentId;
        }
      },
      (currentIdVal) => {
        if (currentIdVal !== undefined) {
          blogId.value = currentIdVal;
          blogPosted.value = false;
        }
      }, {immediate: true, deep: true});

  height.value = client_height();
  window.onresize = () => {
    height.value = client_height();
  }
});

// Call unwatch methods before leave the page
onBeforeRouteLeave(() => {
  nextTick(() => {
    unwatchLoginCard();
    unwatchWriteBlog();
    unwatchBlogOrDraftList();
    window.onresize = null;
  });
});
</script>

<template>
  <BasicInfo ref="basicInfoRef"/>
  <Background :theme="theme"/>
  <div :style="{height: fixedHeight ? `${height}px` : 'auto'}">
    <VaLayout
        class="layout"
        :top="{fixed: true, order: 2}"
        :left="{fixed: true}"
        :right="{fixed: true}"
    >
      <template #top>
        <NavBar :show-search="false" v-model:theme="theme"/>
      </template>

      <template #left v-if="login">
        <SideBar :theme="theme"/>
      </template>

      <template #content>
        <LoginCard v-if="!login" :theme="theme" :name="name" :height="height" ref="loginCardRef"/>
        <div class="mt-5 ml-5" style="width: 100%; height: 100%" v-else>
          <BlogOrDraftList v-if="blogId === null" :theme="theme" ref="blogOrDraftListRef"/>
          <WriteBlog v-if="!blogPosted && blogId !== null" :id="blogId" :theme="theme" ref="writeBlogRef"/>
        </div>
      </template>
    </VaLayout>
  </div>
</template>

<style scoped>

</style>