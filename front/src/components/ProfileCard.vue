<script setup>
import avatarWhite from "@/assets/img/megalobox-white.png";
import avatarBlack from "@/assets/img/megalobox.png";
import {nextTick, ref} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
});

let name = ref("");

nextTick(() => {
  fetch("/user/name")
      .then(r =>
          r.json()
              .then(
                  j => name.value = j.name));
});
</script>

<template>
  <div style="display: flex; width: 100%"
       class="flex-direction-row
                align-center justify-start">
    <VaAvatar v-show="props.theme === 'dark'"
              class="mr-3"
              size="large"
              :src="avatarWhite"
    />
    <VaAvatar v-show="props.theme === 'light'"
              class="mr-3"
              size="large"
              :src="avatarBlack"
    />
    <div style="font-size: 0.9rem"
         class="ml-3 va-title">
      <span style="font-size: x-large">
        {{ name.charAt(0) }}
      </span>{{ name.substring(1, name.length) }}
    </div>
  </div>
  <div class="mt-3">
    <VaBadge
        text="A Gamer"
        color="success"
        class="mr-2"
    />
    <VaBadge
        text="A Developer"
        color="primary"
    />
  </div>
  <div class="mt-3">
    <blockquote class="va-blockquote va-text-block">
      <p class="va-text-bold">
        A man can be
        <span class="va-text-success">
                destroyed
              </span>
        but not defeated.
      </p>
      <p>
        <i>- Ernest Hemingway</i>
      </p>
    </blockquote>
  </div>
</template>

<style scoped>

</style>