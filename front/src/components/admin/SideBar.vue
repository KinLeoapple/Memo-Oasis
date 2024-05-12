<script setup>
import SideBarButton from "@/components/button/SideBarButton.vue";
import {Feather, Tools} from "@vicons/fa";
import {nextTick} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
});

const btnOnClick = (e) => {
  e.currentTarget.parentElement.querySelectorAll(".button").forEach(el => {
    el.classList.remove("active");
  });
  e.currentTarget.querySelector(".button").classList.add("active");
}

nextTick((e) => {
  document.querySelector(".inside-side-bar").firstElementChild.click(e);
});
</script>

<template>
  <div class="mt-5 ml-3 side-bar"
       :class="{
      'dark': theme === 'dark',
      'light': theme === 'light',
      'active-dark': theme === 'dark',
      'active-light': theme === 'light'}">
    <div class="inside-side-bar">
      <SideBarButton
          :theme="theme"
                     v-for="(btn, index) in sideButtons"
                     :key="index"
                     :icon="btn.icon"
                     :popover-text="btn.popoverText"
                     :popover-left="btn.popoverLeft"
                     @click="btnOnClick"/>
    </div>
  </div>
</template>

<script>
import {Feather, Tools} from "@vicons/fa";

export default {
  data() {
    return {
      sideButtons: [
        {
          icon: Feather,
          popoverText: "Write Blog",
          popoverLeft: 152
        },
        {
          icon: Tools,
          popoverText: "Config",
          popoverLeft: 132
        }
      ]
    };
  },
};
</script>

<style scoped>
@import "@/assets/css/admin-side-button.css";

.side-bar {
  border-radius: 999px;
  background-color: var(--background-color);
  backdrop-filter: blur(5px);
}

.dark {
  --background-color: rgb(31, 38, 47);
}

.light {
  --background-color: rgb(255, 255, 255);
}

.inside-side-bar {
  display: flex;
  flex-direction: column;
  min-height: 100px;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 5px;
}
</style>