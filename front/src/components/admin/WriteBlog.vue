<script setup>
import BlogWriter from "@/components/admin/BlogWriter.vue";
import {ref, nextTick, watch, computed} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
  name: {
    type: String,
  },
  pass: {
    type: String,
  }
});

const inputRef = ref();
const showInput = ref(false);
const writerRef = ref();
const title = ref("Untitled");
const saved = ref(false);

const computedSaved = computed({
  get() {
    return saved.value;
  },
  set(val) {
    saved.value = val;
  }
});

const showInputVal = computed({
  get() {
    return showInput.value;
  },
  set(val) {
    showInput.value = val;
  }
});

const titleTextOnClick = () => {
  nextTick(() => {
    showInput.value = true;
    inputRef.value.focus();
  });
}

const inputOnChange = (e) => {
  if (showInput.value)
    title.value = e.target.value === "" ? "Untitled" : e.target.value;
}

const inputOnBlur = () => {
  nextTick(() => {
    showInput.value = false;
  });
}

nextTick(() => {
  let unwatch;
  try {
    unwatch = watch(() => writerRef.value.changeSaved, (val) => {
      if (val !== null)
        computedSaved.value = val;
    }, {immediate: true, deep: true});
  } catch (_) {
    unwatch();
  }
});
</script>

<template>
  <VaCard
      :outlined="theme === 'dark'"
      :bordered="theme !== 'dark'"
      class="mt-5 ml-5"
      style="width: calc(100% - 5rem); height: calc(100% - 5rem);">
    <VaCardTitle style="position: relative" class="title overflow-hidden">
      <div class="title-text">
        <p v-show="!showInputVal" class="title-p" @click="titleTextOnClick">{{ title }}</p>
        <input ref="inputRef"
               type="text"
               placeholder="Type Title..."
               name="text"
               class="title-input"
               :style="{position: `${showInputVal ? '' : 'absolute'}`,
               margin: `auto`,
               top: `${showInputVal ? '0' : '-9999px'}`}"
               :value="title"
               @change="inputOnChange"
               @blur="inputOnBlur"
        >
      </div>
      <div v-show="computedSaved !== null" class="saved">
        <VaBadge
            :color="computedSaved ? 'success' : 'warning'"
            dot
            :offset="[-10, 10.5]"
        />
        <p v-html="computedSaved ? 'Saved' : 'Unsaved'"/>
      </div>
    </VaCardTitle>
    <VaDivider/>
    <VaCardContent style="display:flex; width: 100%; height: calc(100% - 5rem); padding: 0">
      <BlogWriter ref="writerRef" :theme="theme" :name="name" :pass="pass" :title="title"/>
    </VaCardContent>
  </VaCard>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: .5rem;
  padding-bottom: 0;
}

.title-text {
  font-size: large;
}

.title-text p {
  cursor: pointer;
  transition: color .2s ease;
}

.title-text p:hover {
  color: var(--va-primary);
}

.title-input {
  border-radius: 10px;
  font-size: 0.9rem;
  outline: 2px solid #FEBF00;
  border: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #e2e2e2;
  outline-offset: 3px;
  padding: 2px 1rem;
  transition: outline-offset 0.25s, background-color 0.25s;
}

.title-input:focus {
  outline-offset: 5px;
  background-color: #fff
}

.saved {
  display: flex;
  flex-direction: row;
  margin-left: 9px;
  cursor: default;
}
</style>