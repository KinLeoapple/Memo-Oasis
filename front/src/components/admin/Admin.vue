<script setup>

import Background from "@/components/common/Background.vue";
import NavBar from "@/components/common/NavBar.vue";
import {computed, nextTick, ref, watch} from "vue";
import {useColors} from "vuestic-ui";
import FooterBar from "@/components/common/FooterBar.vue";
import BasicInfo from "@/components/common/BasicInfo.vue";
import {client_height} from "@/assets/js/client_size.js";
import LoginCard from "@/components/admin/LoginCard.vue";

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
const login = ref(false);

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

  height.value = client_height();
  window.onresize = () => {
    height.value = client_height();
  }
});
</script>

<template>
  <BasicInfo ref="basicInfoRef"/>
  <Background/>
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

      <template #left>

      </template>

      <template #right>

      </template>

      <template #content v-if="!login">
        <LoginCard :theme="theme" :name="name"/>
      </template>
    </VaLayout>
  </div>
  <FooterBar :theme="theme" :name="desi_name" :page="desi_page"/>
</template>

<style scoped>

</style>