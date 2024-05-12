<script setup>
import {marked} from "marked";
import {computed, ref, watch} from "vue";
import GoBackButton from "@/components/button/GoBackButton.vue";
import {MdPreview} from "md-editor-v3";

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
            lazy
        />
      </div>
      <VaCardContent>
        <MdPreview id="render" :theme="theme === 'dark' ? 'dark' : 'light'" style="background-color: transparent"
                   v-if="currentContent !== null"
                   :modelValue="markdown"
                   :preview-theme="'github'"/>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<style scoped>
.blog-render {
  background-color: var(--va-text-block) !important;
}
</style>