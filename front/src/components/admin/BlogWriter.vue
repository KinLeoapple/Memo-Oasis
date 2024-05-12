<script setup>

import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import "@/assets/css/editor.css";
import {computed, ref} from "vue";
import {post_blog, post_draft} from "@/assets/js/api.js";

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
  },
  title: String,
});

const text = ref("");
const id = ref(null);
const changeSaved = ref(false);
const saved = ref(false);

const textVal = computed({
  get() {
    return text.value
  },
  set(value) {
    text.value = value;
  }
});

const change = (val) => {
  changeSaved.value = false;
  post_draft(props.name, props.pass, props.title, val, id.value).then(r => {
    if (r !== null) {
      if (r.saved !== null) {
        if (id.value === null)
          id.value = r.saved;
        changeSaved.value = true;
      }
    }
  });
}

const save = (val) => {
  saved.value = false;
  post_blog(props.name, props.pass, props.title, val, id.value).then(r => {
    if (r !== null) {
      if (r.saved !== null) {
        if (id.value === null)
          id.value = r.saved;
        saved.value = true;
      }
    }
  });
};
</script>

<template>
  <div class="blog-writer"
       :class="{'md-editor-resize-operate-light': theme === 'light',
       'md-editor-resize-operate-dark': theme === 'dark'}">
    <MdEditor
        class="editor"
        :theme="theme === 'dark' ? 'dark' : 'light'"
        v-model="textVal"
        :previewTheme="'github'"
        :html-preview="false"
        placeholder="Type your markdown..."
        :toolbars-exclude="exclude"
        :footers="['markdownTotal']"
        :input-box-witdh="'50%'"
        :scroll-auto="true"
        :on-change="change"
        :on-save="save"
        style="background-color: transparent; border: none; height: 100%"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exclude: [
        '-',
        'revoke',
        'next',
        'save',
        'pageFullscreen',
        'fullscreen',
        'htmlPreview',
        'catalog',
        'github'
      ]
    };
  },
};
</script>

<style scoped>
.blog-writer {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: var(--va-form-element-border-radius);
}
</style>