<script setup>

import {Icon} from "@vicons/utils";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
  icon: {

  },
  popoverText: {
    type: String,
  },
  popoverLeft: {
    type: Number,
  },
  active: {
    type: Boolean,
  }
});
</script>

<template>
  <VaHover v-model="isHover">
    <div class="button-container"
         :class="{
      'dark': theme === 'dark',
      'light': theme === 'light'
    }">
      <button class="button">
        <Icon class="icon">
          <component
          :is="icon"/>
        </Icon>
      </button>

      <VaChip v-show="isHover"
              :shadow="false"
              readonly
              color="secondary"
              class="mr-6 popover va-text-secondary va-text-capitalize"
              :style="{marginLeft: `${popoverLeft}px`}"
      >
        {{ props.popoverText }}
      </VaChip>
    </div>
  </VaHover>
</template>

<script>
export default {
  data() {
    return {
      isHover: false,
    };
  },
};
</script>

<style scoped>
@import "@/assets/css/admin-side-button.css";

.dark {
  --background-color: rgba(101, 101, 101, 0.44);
}

.light {
  --background-color: rgba(38, 38, 38, 0.44);
}

.popover {
  margin-left: 152px;
}
</style>