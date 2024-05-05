<script setup>

import {Icon} from "@vicons/utils";
import {Feather} from "@vicons/fa";
</script>

<template>
  <VaPopover placement="right" message="Write Blog">
    <div class="button-container">
      <button class="button">
        <Icon class="icon">
          <Feather/>
        </Icon>
      </button>
    </div>
  </VaPopover>
</template>

<style scoped>
@import "@/assets/css/admin-side-button.css";
</style>