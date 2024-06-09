<script setup>
import {nextTick, ref} from "vue";
import {
  delete_blog, delete_draft,
  get_blog,
  get_blog_all,
  get_blog_content,
  get_draft,
  get_draft_all,
  get_draft_content
} from "@/assets/js/api.js";
import {to_date} from "@/assets/js/to_date.js";
import {Icon} from "@vicons/utils";
import {Plus, Minus} from "@vicons/fa";

const props = defineProps({
  theme: {
    type: String,
    default: () => "dark",
  },
  token: {
    type: String,
    default: () => localStorage.getItem("token"),
  }
});

const currentButton = ref("");
const buttonGroup = ref(["BLOG", "DRAFT"]);
const currentList = ref([]);
const currentId = ref(null);
const showDeleteBox = ref(false);
const currentSelectedItem = ref(null);

const checkLink = (id) => {
  Promise.all([get_draft(props.token, id), get_blog(id)]).then(arr => {
    let d = arr[0];
    let b = arr[1];

    get_content(id).then(content => {
      switch (currentButton.value) {
        case "BLOG": {
          b.content = content;
          b.hasLink = d.title !== undefined;
          currentList.value.push(b);
          break;
        }
        case "DRAFT": {
          d.content = content;
          d.hasLink = b.title !== undefined;
          currentList.value.push(d);
          break;
        }
      }
    });
  });
}

const update_draft_list = () => {
  currentList.value = [];
  get_draft_all(props.token).then(r => {
    if (r !== null) {
      for (let i in r) {
        checkLink(r[i].id);
      }
    }
  });
}

const update_blog_list = () => {
  currentList.value = [];
  get_blog_all().then(r => {
    if (r !== null) {
      for (let i in r) {
        checkLink(r[i].id);
      }
    }
  });
}


const get_content = (id) => {
  return new Promise(resolve => {
    nextTick(() => {
      switch (currentButton.value) {
        case "BLOG": {
          get_blog_content(id).then(c => {
            if (c !== null) {
              resolve(c.content);
            }
          });
          break;
        }
        case "DRAFT": {
          get_draft_content(props.token, id).then(c => {
            if (c !== null) {
              resolve(c.content);
            }
          });
          break;
        }
      }
    });
  });
}

const targetDelete = (item) => {
  showDeleteBox.value = true;
  currentSelectedItem.value = item;
}

const remove = (id) => {
  currentSelectedItem.value = null;
  switch (currentButton.value) {
    case "BLOG": {
      Promise.all([delete_draft(props.token, id), delete_blog(props.token, id)]).then(arr => {
        let r = arr[1];

        if (r !== null) {
          if (r.deleted === true) {
            update_blog_list();
          }
        }
      });
      break;
    }
    case "DRAFT": {
      delete_draft(props.token, id).then(r => {
        if (r !== null) {
          if (r.deleted === true) {
            update_draft_list();
          }
        }
      });
      break;
    }
  }
}

const switchList = (button) => {
  nextTick(() => {
    currentButton.value = button;
    switch (button) {
      case "BLOG": {
        update_blog_list();
        break;
      }
      case "DRAFT": {
        update_draft_list();
        break;
      }
    }
  });
}

const modifyBlogOrDraft = (id = null) => {
  currentId.value = id;
}

nextTick(() => {
  document.querySelector("#blog-or-draft-list").firstElementChild.click();
});

defineExpose({currentId});
</script>

<template>
  <VaModal
      v-model="showDeleteBox"
      ok-text="Yes"
      @ok="remove(currentSelectedItem.id)"
      @cancel="currentSelectedItem.value = null"
  >
    <h6 class="va-h6">Are You Sure?</h6>
    <blockquote class="mt-5 va-blockquote">
      <p>Your data may leave you for a long time.</p>
      <p v-if="currentSelectedItem.hasLink && currentButton === 'BLOG'">The draft will also be deleted.</p>
    </blockquote>
  </VaModal>

  <div class="navbar">
    <div id="blog-or-draft-list" class="button-group">
      <VaButton class="button"
                round v-for="(button, index) in buttonGroup" :key="index"
                :color="button === currentButton ? 'Primary' : 'BackgroundBorder'"
                @click="switchList(button)">
        {{ button }}
      </VaButton>
    </div>
  </div>


  <div class="container">
    <div v-if="currentButton === 'DRAFT'" class="card-container">
      <VaCard class="pointer item"
              :outlined="theme === 'dark'"
              :bordered="theme !== 'dark'"
              @click="modifyBlogOrDraft(-1)">
        <VaCardContent class="item-add">
          <Icon style="font-size: 2rem">
            <Plus/>
          </Icon>
          <p style="font-size: 1rem;" class="va-text-capitalize">Add</p>
        </VaCardContent>
      </VaCard>
    </div>
    <div v-if="currentList.length > 0" class="card-container" v-for="(item, index) in currentList.sort((a, b) => {
      return Number(b.date) - Number(a.date);
    })" :key="index" @click="modifyBlogOrDraft(item.id)">
      <VaValue v-slot="isHover">
        <VaCard class="pointer item"
                :outlined="theme === 'dark'"
                :bordered="theme !== 'dark'"
                @mouseenter="isHover.value = true"
                @mouseleave="isHover.value = false">
          <VaCardTitle class="item_title">
            <p>{{ item.title }}</p>
            <VaButton
                @click.stop="targetDelete(item)"
                v-show="isHover.value"
                color="danger"
                round
                size="small">
              <Icon>
                <Minus/>
              </Icon>
            </VaButton>
          </VaCardTitle>
          <VaCardContent
              style="display: flex; flex-direction: column; gap: 1rem">
            <blockquote
                style="font-size: 1rem;"
            >
              <p class="va-text-truncate">{{ item.content }}</p>
            </blockquote>
            <div :class="{'more-info': theme === 'dark',
            'more-info-light': theme === 'light'}" :style="{
              justifyContent: item.hasLink ? 'space-between' : 'end',
            }">
              <VaBadge
                  style="padding: 6px 12px;"
                  v-if="item.hasLink"
                  :text="'Had ' + (currentButton === 'BLOG' ? 'Draft' : 'Blog')"
                  color="success"
                  class="mr-2"
              />
              <div class="va-text-secondary va-text-justify"
                   :class="{'details': theme === 'dark',
                'details-light': theme === 'light'}">
                <p>{{ to_date(item.date) }}</p>
              </div>
            </div>
          </VaCardContent>
        </VaCard>
      </VaValue>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 120px;
  z-index: 999
}

.button-group {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  margin-bottom: 20px;
}

.button {
  margin-right: 1rem;
}

.container {
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: stretch;
  align-content: flex-start;
  margin-top: 100px;
  margin-bottom: 30px;
}

.card-container {
  max-width: 300px;
  min-width: 300px;
}

.item-add {
  width: 100%;
  height: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.item_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
}

.item {
  width: 100%;
  height: 100%;
  max-height: 150px;
  backdrop-filter: blur(30px) !important;
  background-color: rgba(0, 0, 0, 0.24) !important;
  transition: background-color .2s ease, backdrop-filter .2s ease !important;
  cursor: pointer;
}

.item:hover {
  backdrop-filter: blur(10px) !important;
  background-color: rgba(47, 47, 47, 0.24) !important;
}

.more-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
}

.more-info-light {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
}

.details {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 0.94rem;
  border-radius: 999px;
  background-color: rgb(47, 47, 47, 0.24);
  padding: 6px 12px;
  margin-top: 10px;
}

.details-light {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 0.94rem;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.14);
  padding: 6px 12px;
  margin-top: 10px;
  color: var(--va-text-primary) !important;
}
</style>