<script setup>
import logo from '@/assets/img/site-logo/logo.png';
import {nextTick, ref} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
});

let name = ref("");
let page = ref("");

nextTick(() => {
  fetch("http://localhost:8080/designer/name")
      .then(r =>
          r.json()
              .then(
                  j => name.value = j.name));
  fetch("http://localhost:8080/designer/page")
      .then(r =>
          r.json()
              .then(
                  j => page.value = j.page));
});
</script>

<template>
  <div
      :class="{
      'footer-dark': theme === 'dark',
      'footer-light': theme === 'light'
      }"
      class="mb-0 footer footer-dark">
    <img
        class="item"
        width="100px"
        height="100px"
        :src="logo"
        alt=""/>
    <div class="ml-3 mb-5 item">
      <p class="va-text-bold va-text-secondary">
        Copyright © 2023 - {{ new Date().getFullYear() }}
      </p>
      <div class="dot"></div>
      <span
          class="va-text-bold"
          style="color: #FFFFFF">
          <a
              href="/"
              class="link">
            Memo Oasis
          </a>
        </span>
    </div>

    <VaDivider
        style="height: 16px"
        class="ml-3 mr-3 mb-5"
        vertical
        color="success"
    />

    <div class="mr-3 mb-5 item">
      <p class="va-text-bold va-text-secondary">
        Designed by
      </p>
      <div class="dot"></div>
      <span
          class="va-text-bold"
          style="color: #FFFFFF">
          <a
              :href="page"
              target="_blank"
              class="link">
            {{ name }}
          </a>
        </span>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/common.css";

.footer {
  position: absolute;
  margin: auto;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  max-height: 150px;
  width: 100%;
  overflow: hidden;
}

.footer-dark {
  background-color: rgb(19, 26, 34);
  color: rgb(241, 241, 241);
  fill: rgb(241, 241, 241);
}

.footer-light {
  background-color: rgb(236, 240, 241);
  color: rgb(38, 40, 36);
  fill: rgb(38, 40, 36);
  box-shadow: 2px 0 8px var(--va-shadow);
}

.item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.link {
  color: var(--va-text-primary);
}

.link:hover {
  color: var(--va-link-color);
}
</style>