<script setup>
import BlogWriter from "@/components/admin/BlogWriter.vue";
import {ref, nextTick, watch, computed} from "vue";
import {get_category, get_category_all, post_category} from "@/assets/js/api.js";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
  token: {
    type: String,
    default: () => localStorage.getItem("token")
  },
});

const options = ref([]);
const optionVal = ref("");
const id = ref(null);
const inputRef = ref();
const showInput = ref(false);
const writerRef = ref();
const title = ref("Untitled");
const saved = ref(false);
const showPostBox = ref(false);
const post = ref(false);
const description = ref("");
const showNewCategory = ref(false);
const catName = ref("");

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

const onPostClick = () => {
  showPostBox.value = true;
}

const targetPost = () => {
  post.value = true;
}

const postCategory = () => {
  post_category(props.token, catName.value).then(r => {
    if (r !== null) {
      if (r.posted !== null && r.posted !== undefined) {
        showNewCategory.value = false;
        catName.value = "";
        getCategory();
      }
    }
  });
}

const getCategory = () => {
  options.value = [];
  get_category_all().then(r => {
    if (r !== null) {
      for (let i in r) {
        get_category(r[i].id).then(c => {
          options.value.push(c);
        });
      }
    }
  });
}

nextTick(() => {
  getCategory();

  let unwatchChangeSaved;
  let unwatchId;

  // watch changed save
  try {
    unwatchChangeSaved = watch(() => {
      if (writerRef.value != null)
        return writerRef.value.changeSaved
      unwatchChangeSaved();
    }, (val) => {
      if (val !== null)
        computedSaved.value = val;
    }, {immediate: true, deep: true});
  } catch (_) {
    unwatchChangeSaved()
  }

  // watch id
  try {
    unwatchId = watch(() => {
      if (writerRef.value != null)
        return writerRef.value.id
      unwatchId();
    }, (val) => {
      if (val !== null)
        id.value = val;
    }, {immediate: true, deep: true});
  } catch (_) {
    unwatchId();
  }
});
</script>

<template>
  <VaModal
      v-model="showPostBox"
      ok-text="Confirm"
      @ok="targetPost"
  >
    <h6 class="va-h6 va-title">
      Blog Details
    </h6>
    <div class="modal-input-container">
      <div class="tag-selector">
        <VaSelect
            v-model="optionVal"
            placeholder=""
            :options="options"
            :textBy="(option) => option.catName"
            no-options-text="No Categories Found"
            label="Category"
            required-mark
        />
        <VaButton
            style="height: 0"
            @click="showNewCategory = true"
            :loading="showNewCategory"
        >New
        </VaButton>
      </div>
      <VaTextarea class="details-input"
                  v-model="description"
                  label="Description"
                  :max-length="500"
                  required-mark
                  autosize
                  counter
                  min-rows="5"
                  max-rows="5"
                  :rules="[
                    (v) => v && v.length > 0 || 'Required',
                    (v) => v && v.length <= 500 || 'Too Many Text',
                  ]"
      />
    </div>
  </VaModal>

  <VaModal
      v-model="showNewCategory"
      ok-text="Create"
      size="small"
      @ok="postCategory"
  >
    <h6 class="va-h6 va-title">
      New Category
    </h6>
    <div class="modal-input-container">
      <VaInput
          v-model="catName"
          label="Tag Name"
          :max-length="20"
          counter
          required-mark
          :rules="[
            (v) => v && v.length > 0 || 'Required',
            (v) => v && v.length <= 20 || 'Too Many Text',
          ]"
      />
    </div>
  </VaModal>

  <VaCard
      :outlined="theme === 'dark'"
      :bordered="theme !== 'dark'"
      class="mt-5 ml-5"
      style="width: calc(100% - 5rem); height: calc(100% - 5rem);">
    <VaCardTitle style="position: relative" class="title overflow-hidden">
      <div class="title-left">
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
      </div>
      <div>
        <VaButton
            :loading="showPostBox"
            @click="onPostClick"
        >Post
        </VaButton>
      </div>
    </VaCardTitle>
    <VaDivider/>
    <VaCardContent style="display:flex; width: 100%; height: calc(100% - 5rem); padding: 0">
      <BlogWriter ref="writerRef"
                  :id="id"
                  :theme="theme"
                  :name="name"
                  :pass="pass"
                  :title="title"
                  :post="post"
                  :cat-id="optionVal.id"
                  :blog-des="description"/>
    </VaCardContent>
  </VaCard>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: .5rem;
  padding-bottom: 0;
}

.title-left {
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

.modal-input-container {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 30px;
}

.tag-selector {
  display: flex;
  flex-direction: row;
  gap: .7rem;
  justify-content: space-between;
  align-items: end;
}
</style>