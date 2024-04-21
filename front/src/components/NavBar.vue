<script setup>
import {Search} from "@vicons/fa";
import {Icon} from "@vicons/utils";
import {computed, ref, watch} from "vue";
import {useColors} from "vuestic-ui";

const {applyPreset, currentPresetName} = useColors();
applyPreset(localStorage.getItem("theme") || "dark");

const theme = ref(localStorage.getItem("theme") || "dark");
const switchTheme = computed({
  get() {
    return currentPresetName.value;
  },
  set(value) {
    applyPreset(value);
    localStorage.setItem("theme", value);
  }
});

watch(currentPresetName, (val) => {
  theme.value = val;
});
</script>

<template>
  <VaNavbar
      :shadowed="theme !== 'dark'"
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
        <VaSwitch
            v-model="switchTheme"
            color="#5123a1"
            off-color="#ffd300"
            style="--va-switch-checker-background-color: #252723;"
            true-value="dark"
            false-value="light"
        >
          <template #innerLabel>
            <div class="va-text-center">
              <VaIcon
                  :name="theme === 'light' ? 'light_mode' : 'dark_mode'"
              />
            </div>
          </template>
        </VaSwitch>
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