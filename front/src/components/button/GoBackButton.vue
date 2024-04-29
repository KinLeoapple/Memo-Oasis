<script setup>

</script>

<template>
  <button class="button">

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
    </svg>

    <div class="text va-text-bold">
      Back
    </div>

  </button>
</template>

<style scoped>
.button {
  background-color: rgba(54, 84, 255, 0.8);
  color: #fff;
  width: 7.5em;
  height: 2.9em;
  border: #00000000 0.2em solid;
  border-radius: 11px;
  text-align: right;
  cursor: pointer;
  transition: all 0.6s ease;
}

.button:hover {
  background-color: #3654ff;
}

.button svg {
  transform: rotate(180deg);
}

.button svg {
  width: 1.6em;
  margin: -0.2em 0.8em 1em;
  position: absolute;
  display: flex;
  transition: all 0.6s ease;
}

.text {
  margin: 0 1.5em
}
</style>