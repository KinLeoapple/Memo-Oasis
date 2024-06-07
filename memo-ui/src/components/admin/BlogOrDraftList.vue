<script setup>
import {nextTick, ref} from "vue";
import {
  get_blog,
  get_blog_all,
  get_blog_content,
  get_draft,
  get_draft_all,
  get_draft_content
} from "@/assets/js/api.js";
import {to_date} from "@/assets/js/to_date.js";
import {Icon} from "@vicons/utils";
import {Plus} from "@vicons/fa";

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


const update_draft_list = () => {
  currentList.value = [];
  get_draft_all(props.token).then(r => {
    if (r !== null) {
      for (let i in r) {
        get_draft(props.token, r[i].id).then(d => {
          if (d !== null) {
            get_content(r[i].id).then(content => {
              d.content = content;
              currentList.value.push(d);
            });
          }
        });
      }
    }
  });
}

const update_blog_list = () => {
  currentList.value = [];
  get_blog_all().then(r => {
    if (r !== null) {
      for (let i in r) {
        get_blog(r[i].id).then(b => {
          get_content(r[i].id).then(content => {
            b.content = content;
            currentList.value.push(b);
          });
        });
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
  <div id="blog-or-draft-list" class="button-group">
    <VaButton class="button"
              round v-for="(button, index) in buttonGroup" :key="index"
              :color="button === currentButton ? 'Primary' : 'BackgroundBorder'"
              @click="switchList(button)">
      {{ button }}
    </VaButton>
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
      <VaCard class="pointer item"
              :outlined="theme === 'dark'"
              :bordered="theme !== 'dark'">
        <VaCardTitle style="font-size: 1.5rem">{{ item.title }}</VaCardTitle>
        <VaCardContent
            style="display: flex; flex-direction: column; gap: 1rem">
          <blockquote
              style="font-size: 1rem;"
          >
            <p class="va-text-truncate">{{ item.content }}</p>
          </blockquote>
          <div :class="{'more-info': theme === 'dark',
            'more-info-light': theme === 'light'}">
            <div class="va-text-secondary va-text-justify"
                 :class="{'details': theme === 'dark',
                'details-light': theme === 'light'}">
              <p>{{ to_date(item.date) }}</p>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<style scoped>
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
  justify-content: end;
  align-items: end;
}

.more-info-light {
  display: flex;
  flex-direction: row;
  justify-content: end;
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