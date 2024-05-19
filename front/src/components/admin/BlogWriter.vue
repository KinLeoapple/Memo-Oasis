<script setup>
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import "@/assets/css/editor.css";
import {computed, nextTick, ref, watch} from "vue";
import {post_blog, post_draft, post_img} from "@/assets/js/api.js";

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
const changedText = ref("");
const id = ref(null);
const changeSaved = ref(null);
const saved = ref(false);
const catId = ref(null);
const blogDes = ref(null);

const textVal = computed({
  get() {
    return text.value
  },
  set(value) {
    text.value = value;
  }
});

const saveDraft = () => {
  post_draft(props.name, props.pass, props.title, text.value, id.value).then(r => {
    if (r !== null) {
      if (r.saved !== null) {
        if (id.value === null)
          id.value = r.saved;
        changeSaved.value = true;
        changedText.value = text.value;
      }
    }
  });
}

const change = () => {
  changeSaved.value = false;
}

const save = (val) => {
  saved.value = false;
  post_blog(props.name, props.pass, props.title, val,
      id.value, catId.value, blogDes.value).then(r => {
    if (r !== null) {
      if (r.saved !== null) {
        if (id.value === null)
          id.value = r.saved;
        saved.value = true;
      }
    }
  });
};


const uploadImg = async (files, callback) => {
  const res = await Promise.all(
      files.map((file) => {
        return new Promise(resolve => {
          const form = new FormData();
          form.append("file", file);
          post_img(form).then(r => {
            if (r.saved !== null) {
              resolve(r.saved);
            }
          });
        });
      })
  );

  let protocol = window.location.protocol;
  let hostname = window.location.hostname;
  let port = window.location.port;
  if (port === null || port === undefined || port === "")
    port = null;

  callback(res.map((id) =>
      `${protocol}//${hostname}${port != null ? `:${8080}` : ""}/img/${id}`
  ));
  document.querySelectorAll(".md-editor-modal-close").forEach(el => {
    el.click();
  });
};

nextTick(() => {
  // save every 10 seconds
  setInterval(() => {
    // do it only the text has changed
    if (changedText.value !== text.value) {
      saveDraft();
    }
  }, 10 * 1000);

  watch(() => props.title, (_) => {
    saveDraft();
  }, {immediate: true, deep: false});
});

defineExpose({changeSaved, saved});
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
        :on-upload-img="uploadImg"
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