<script setup>
import avatarWhite from "@/assets/img/megalobox-white.webp";
import avatarBlack from "@/assets/img/megalobox.webp";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
  name: {
    type: String,
  },
  quote: {
    type: String,
  },
  quoteName: {
    type: String,
  }
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
    <div v-if="props.name !== null"
        style="font-size: 0.9rem"
         class="ml-3 va-title name">
      <span style="font-size: x-large">
        {{ props.name.charAt(0) }}
      </span>{{ props.name.substring(1, props.name.length) }}
    </div>
    <VaSkeleton v-else
                variant="rounded"
                inline
                width="100%"
                height="16px"
                animation="wave"
                style="font-size: 0.9rem"
                class="ml-3 va-title name"/>
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
  <div class="mt-3" v-if="quote !== null">
    <blockquote class="va-blockquote va-text-block">
      <p class="va-text-bold">
       {{ props.quote }}
      </p>
      <p v-if="quoteName !== null">
        <i>- {{ props.quoteName }}</i>
      </p>
    </blockquote>
  </div>
</template>

<style scoped>

</style>