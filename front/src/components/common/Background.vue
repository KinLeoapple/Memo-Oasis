<script setup>

</script>

<template>
  <div class="background"></div>
</template>

<style scoped>
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
</style>