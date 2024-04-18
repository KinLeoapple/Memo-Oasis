<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
});
</script>

<template>
  <VaNavbar
      class="mb-0 footer">
    <template #left>
      <VaNavbarItem class="ml-3 mb-5">
        <p class="va-text-bold va-text-secondary">
          Copyright © 2023 - {{ new Date().getFullYear() }}
        </p>
        <div class="dot"></div>
        <span
            class="va-text-bold"
            style="color: #FFFFFF">
          <a
              href="/"
              class="link">
            Memo
          </a>
        </span>
      </VaNavbarItem>
    </template>

    <template #right>
      <VaDivider
          class="mr-3 mb-5"
          vertical
          color="success"
      />

      <VaNavbarItem class="mr-3 mb-5">
        <p class="va-text-bold va-text-secondary">
          Designed by
        </p>
        <div class="dot"></div>
        <span
            class="va-text-bold"
            style="color: #FFFFFF">
          <a
              href="https://github.com/KinLeoapple"
              target="_blank"
              class="link">
            Kinleoapple
          </a>
        </span>
      </VaNavbarItem>
    </template>
  </VaNavbar>
</template>

<style scoped>
.footer {
  min-height: 150px;
  max-height: 150px;
  overflow: hidden;
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 99999px;
  background: var(--va-secondary);
  margin: 0 6px;
}

.link {
  color: var(--va-text-primary);
}

.link:hover {
  color: var(--va-link-color);
}
</style>