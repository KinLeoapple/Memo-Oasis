<script setup>
import {marked} from "marked";
import hljs from "highlight.js";
import "github-markdown-css"; // markdown style
import "highlight.js/styles/atom-one-dark.css"; // code highlight style
import {computed, ref, watch} from "vue";
import GoBackButton from "@/components/button/GoBackButton.vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
  content: {
    type: String,
    default: () => null
  },
});

const currentContent = ref(null);

const markdownToHtml = computed(() => {
  if (currentContent.value !== null) {
    marked.setOptions({
      renderer: new marked.Renderer(),
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });
    return marked(currentContent.value);
  }
});

const cleanContent = () => {
  currentContent.value = null;
}

const VHighlight = {
  mounted: (el) => {
    let codes = el.querySelectorAll("pre code");
    codes.forEach((code) => {
      hljs.highlightElement(code);
    });
  }
}

watch(() => props.content, (val) => {
  if (val !== null) {
    document.documentElement.scrollTop = 0;
    currentContent.value = val;
  } else
    currentContent.value = null;
});

defineExpose({currentContent});
</script>

<template>
  <div style="min-height: 100%; min-width: 100%; position: relative" v-show="currentContent !== null">
    <GoBackButton
        style="position: absolute; z-index: 9999"
        class="mt-2 ml-2"
        @click="cleanContent"
    />
    <VaCard
        style="position: relative"
        :outlined="theme === 'dark'"
        :bordered="theme !== 'dark'"
        class="mb-5 blog-render overflow-hidden"
    >
      <div class="overflow-hidden">
        <VaImage
            src="https://source.unsplash.com/1920x1080/?nature"
            style="height: 240px"
        />
      </div>
      <VaCardContent class="markdown-body" v-highlight v-html="markdownToHtml"/>
    </VaCard>
  </div>
</template>

<style scoped>
.blog-render {
  background-color: var(--va-text-block) !important;
}

.markdown-body {
  background-color: transparent !important;
  color: var(--va-on-background-primary);
}
</style>