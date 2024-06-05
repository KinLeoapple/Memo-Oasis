<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
});
</script>

<template>
<!--  <div class="background"></div>-->
  <div class="background"
       :class="{'img': theme === 'dark', 'img-light': theme === 'light'}"
  ></div>
</template>

<style scoped>
.background {
  --background-blur: 5px;
  -webkit-filter: blur(var(--background-blur));
  -moz-filter: blur(var(--background-blur));
  -ms-filter: blur(var(--background-blur));
  filter: blur(var(--background-blur));
  position: fixed;
  width: 105%;
  height: 105%;
  background-image: radial-gradient(var(--va-background-primary) 55%, #0000), linear-gradient(
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
}

.img {
  background-image: url("@/assets/img/background.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.img-light {
  background-image: url("@/assets/img/background-white.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>