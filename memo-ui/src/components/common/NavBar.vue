<script setup>
import {Search} from "@vicons/fa";
import {Icon} from "@vicons/utils";
import {useColors} from "vuestic-ui";
import SwitchThemeButton from "@/components/button/SwitchThemeButton.vue";
import {useRouter} from "vue-router";
import {ref} from "vue";

const {applyPreset} = useColors();
applyPreset(localStorage.getItem("theme") || "dark");

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();

const currentPath = ref(router.currentRoute.value.path);
</script>

<template>
  <VaNavbar
      style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);"
      color="backgroundElement"
      class="mb-3 overflow-hidden"
  >
    <template #left>
      <VaNavbarItem v-if="props.showSearch" class="ml-3">
        <VaInput
            background="transparent"
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
          <router-link :to="nav.path" replace>
            <VaButton
                round gradient :preset="nav.path === currentPath ? '' : 'secondary'">
              {{ nav.name }}
            </VaButton>
          </router-link>
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
          name: "Home",
          path: "/"
        },
        {
          name: "Admin",
          path: "/admin"
        }
      ]
    };
  },
};
</script>

<style scoped>

</style>