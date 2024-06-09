<script setup>
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import "@/assets/css/editor.css";
import {computed, nextTick, onBeforeUnmount, ref, watch} from "vue";
import {get_blog_content, get_draft_content, post_blog, post_draft, post_img} from "@/assets/js/api.js";
import {isHTML} from "@/assets/js/is_html.js";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
  token: {
    type: String,
    default: () => localStorage.getItem("token")
  },
  title: {
    type: String,
    default: ""
  },
  post: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: null
  },
  catId: {
    type: String,
    default: null
  },
  blogDes: {
    type: String,
    default: null
  }
});

const text = ref("");
const changedText = ref("");
const id = ref(props.id);
const changeSaved = ref(null);
const saved = ref(false);

const textVal = computed({
  get() {
    return text.value
  },
  set(value) {
    text.value = value;
  }
});

const saveDraft = () => {
  post_draft(props.token, props.title, text.value, id.value).then(r => {
    if (r !== null) {
      if (r.saved !== null && r.saved !== undefined) {
        if (id.value === null || id.value < 0)
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

const save = () => {
  saved.value = false;
  post_blog(props.token, props.title, text.value,
      props.catId, props.blogDes, props.id).then(r => {
    if (r !== null) {
      if (r.saved !== null && r.saved !== undefined) {
        if (id.value === null || id.value < 0)
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
          post_img(props.token, file).then(r => {
            if (r.saved !== null && r.saved !== undefined) {
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

const sanitize = (html) => {
  if (textVal.value !== null) {
    if (isHTML(textVal.value)) {
      return textVal.value;
    }
    return html;
  }
}

let timer = null;
nextTick(() => {
  // save every 10 seconds
  timer = setInterval(() => {
    // do it only the text has changed
    if (changedText.value !== text.value) {
      saveDraft();
    }
  }, 10 * 1000);

  watch(() => props.title, (_) => {
    saveDraft();
  }, {immediate: true, deep: false});

  watch(() => props.post, (_) => {
    save();
  }, {immediate: true, deep: false});

  get_draft_content(props.token, id.value).then(d => {
    if (d !== null && d.content !== "") {
      text.value = d.content;
    } else {
      get_blog_content(id.value).then(b => {
        if (b !== null && b.content !== "") {
          text.value = b.content;
        } else {
          textVal.value = "";
          id.value = -1;
        }
      });
    }
  });
});

onBeforeUnmount(() => {
  try {
    clearInterval(timer);
  } catch (_) {
  }
});

defineExpose({changeSaved, saved, id});
</script>

<template>
  <div class="blog-writer"
       :class="{'md-editor-resize-operate-light': theme === 'light',
       'md-editor-resize-operate-dark': theme === 'dark'}">
    <MdEditor
        :language="'en-US'"
        class="editor"
        :sanitize="sanitize"
        :theme="theme === 'dark' ? 'dark' : 'light'"
        v-model="textVal"
        :previewTheme="'vuepress'"
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