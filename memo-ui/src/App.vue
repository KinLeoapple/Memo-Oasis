<script setup>
import {nextTick} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

nextTick(() => {
    router.replace('/');
});
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>