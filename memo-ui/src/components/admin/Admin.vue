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
import DraftList from "@/components/admin/DraftList.vue";

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
const loginCardRef = ref(null);
const login = ref(false);
const writeBlogRef = ref(null);
const blogPosted = ref(true);

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
        if (loginVal)
          unwatchLoginCard();
      }, {immediate: true, deep: true});

  // Watch login state
  unwatchWriteBlog = watch(() => {
        if (writeBlogRef.value != null)
          return writeBlogRef.value.afterPost;
        else
          return true;
      },
      (afterPostVal) => {
        blogPosted.value = afterPostVal;
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
    window.onresize = null;
  });
});
</script>

<template>
  <BasicInfo ref="basicInfoRef"/>
  <Background :theme="theme"/>
  <div :style="{height: `${height}px`}">
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
        <LoginCard v-if="!login" :theme="theme" :name="name" ref="loginCardRef"/>
        <div style="width: 100%; height: 100%" v-else>
          <DraftList/>
          <WriteBlog v-if="!blogPosted" :theme="theme" ref="writeBlogRef"/>
        </div>
      </template>
    </VaLayout>
  </div>
</template>

<style scoped>

</style>