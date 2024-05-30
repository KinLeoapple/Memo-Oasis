<script setup>
import img from "@/assets/img/img.png";
import {marked} from "marked";
import {computed, ref, watch} from "vue";
import GoBackButton from "@/components/button/GoBackButton.vue";
import {MdPreview} from "md-editor-v3";
import {isHTML} from "@/assets/js/is_html.js";

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
const maxTitle = ref(null);
const blogIndex = ref(null);

const markdown = computed(() => {
  if (currentContent.value !== null) {
    let anchor = 0;
    let rendererMD = new marked.Renderer();
    rendererMD.heading = (text, level, _) => {
      if (maxTitle.value === null || level < maxTitle.value) {
        maxTitle.value = level;
      }
      anchor += 1;

      if (blogIndex.value === null) {
        blogIndex.value = [];
      }

      let isExists = false;
      for (let i = 0; i < blogIndex.value.length; i++) {
        if (blogIndex.value[i].id === anchor) {
          isExists = true;
          break;
        }
      }

      if (!isExists) {
        blogIndex.value.push(
            {
              'id': anchor,
              'tag': level,
              'text': text
            }
        );
      }
      return `<h${level}>${text}</h${level}>`;
    }

    marked.setOptions({
      renderer: rendererMD,
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });
    marked(currentContent.value);
    return currentContent.value;
  }
});

const cleanContent = () => {
  currentContent.value = null;
  maxTitle.value = null;
  blogIndex.value = null;
}

const sanitize = (html) => {
  if (currentContent.value !== null) {
    if (isHTML(currentContent.value)) {
      return currentContent.value;
    }
    return html;
  }
}

watch(() => props.content, (val) => {
  if (val !== null) {
    document.documentElement.scrollTop = 0;
    currentContent.value = val;
  } else
    currentContent.value = null;
});

defineExpose({currentContent, blogIndex, maxTitle});
</script>

<template>
  <div style="min-height: 100%; min-width: 100%; position: relative" v-show="currentContent !== null">
    <GoBackButton
        style="position: absolute; z-index: 9999; background: var(--va-primary)"
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
            :src="img"
            style="height: 240px"
            lazy
        />
      </div>
      <VaCardContent style="padding: 0">
        <MdPreview id="render" :theme="theme === 'dark' ? 'dark' : 'light'"
                   style="background-color: transparent !important;"
                   v-if="currentContent !== null"
                   :language="'en-US'"
                   :modelValue="markdown"
                   :sanitize="sanitize"
                   :preview-theme="'vuepress'"/>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<style scoped>
.blog-render {
  background-color: var(--va-text-block) !important;
}
</style>