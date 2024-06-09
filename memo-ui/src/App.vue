<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

nextTick(() => {
  router.replace('/');
});

import * as THREE from "three";
import BIRDS from "vanta/dist/vanta.birds.min";
import {useColors} from "vuestic-ui";
import {client_height, client_width} from "@/assets/js/client_size.js";

const {currentPresetName, applyPreset} = useColors();
const boxRef = ref();
let vantaEffect;

const set_bg = () => {
  if (vantaEffect)
    vantaEffect.destroy();
  vantaEffect = BIRDS({
    el: boxRef.value,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    height: client_height(),
    minWidth: 200.00,
    width: client_width(),
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: currentPresetName.value === "dark" ? 0x10102e : 0xc0c0ff
  });
  document.getElementById("app").style.backgroundColor =
      currentPresetName.value === 'dark' ? '#10102e' : '#bebefd';
}

watch(currentPresetName, (_) => {
  set_bg();
});

onMounted(() => {
  set_bg();
});

onUnmounted(() => {
  if (vantaEffect)
    vantaEffect.destroy();
});

nextTick(() => {
  window.onresize = () => {
    vantaEffect.height = client_height() + 100;
    vantaEffect.width = client_width() + 100;
  }
})
</script>

<template>
  <div ref="boxRef" :style="
  {
    background: currentPresetName === 'dark' ? '#10102e' : '#bebefd',
    height: `${client_height()}px`,
    width: `${client_width()}px`,
  }">
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/main.css";

html, body, #app {
  width: 100%;
  height: 100%;
}
</style>