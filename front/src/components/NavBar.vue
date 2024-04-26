<script setup>
import {Search} from "@vicons/fa";
import {Icon} from "@vicons/utils";
import {useColors} from "vuestic-ui";
import SwitchThemeButton from "@/components/button/SwitchThemeButton.vue";

const {applyPreset} = useColors();
applyPreset(localStorage.getItem("theme") || "dark");
</script>

<template>
  <VaNavbar
      style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);"
      color="backgroundElement"
      class="mb-3 overflow-hidden"
  >
    <template #left>
      <VaNavbarItem class="ml-3">
        <VaInput
            placeholder="Search"
            preset="bordered"
        >
          <template #prependInner>
            <Icon color="secondary">
              <Search/>
            </Icon>
          </template>
        </VaInput>
      </VaNavbarItem>
    </template>
    <template #right>
      <VaNavbarItem
          v-for="(nav, index) in navButtons"
          :key="index"
          class="hidden sm:block pointer">
        <VaButton
            round preset="secondary">
          {{ nav.name }}
        </VaButton>
      </VaNavbarItem>
      <VaNavbarItem class="mr-3">
        <SwitchThemeButton/>
      </VaNavbarItem>
    </template>
  </VaNavbar>
</template>

<script>
export default {
  data() {
    return {
      navButtons: [
        {
          name: "Home"
        },
        {
          name: "Tags"
        }
      ]
    };
  },
};
</script>

<style scoped>

</style>