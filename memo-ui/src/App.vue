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

const {currentPresetName} = useColors();
const boxRef = ref();
let vantaEffect;

watch(currentPresetName, (val) => {
  if (val === "light") {
    vantaEffect.destroy();
    vantaEffect = BIRDS({
      el: boxRef.value,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0xc0c0ff
    });
  } else {
    vantaEffect.destroy();
    vantaEffect = BIRDS({
      el: boxRef.value,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0x80824
    });
  }
});

onMounted(() => {
  vantaEffect = BIRDS({
    el: boxRef.value,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: currentPresetName.value === "dark" ? 0x80824 : 0xc0c0ff
  });
});

onUnmounted(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
});
</script>

<template>
  <div ref="boxRef">
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