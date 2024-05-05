<script setup>

import GoBackButton from "@/components/button/GoBackButton.vue";
import {Icon} from "@vicons/utils";
import {User} from "@vicons/fa";
import {Key} from "@vicons/fa";
import {crypt_login} from "@/assets/js/crypt.js";
import {computed, nextTick, ref} from "vue";

const props = defineProps({
  theme: {
    type: String,
    default: () => 'dark'
  },
  name: {
    type: String,
    default: ""
  },
});

const name = ref("");
const pass = ref("");
const isLogin = ref(false);
const isChecking = ref(false);

const checking = computed({
  get() {return isChecking.value},
  set(value) {
    isChecking.value = value;
  }
})

const login = async () => {
  checking.value = true;
    crypt_login(name.value, pass.value).then(r => {
      if (r !== null) {
        isLogin.value = !!r.login;
        checking.value = isLogin.value;
      } else {
        checking.value = false;
      }
    });
}

nextTick(() => {
  window.onkeydown = async (e) => {
    if (e.key === "Enter") {
      if (!checking.value) {
        await login();
      }
    }
  }
});

defineExpose({isLogin});
</script>

<template>
  <div style="height: 100%; width: 100%">
    <router-link to="/" replace>
      <GoBackButton class="ml-3 mt-3" style="position: fixed; background-color: hsl(230 12% 15% / .8)"/>
    </router-link>

    <VaCard
        class="login-card overflow-hidden"
        color="backgroundElement"
        :outlined="theme === 'dark'"
        :bordered="theme !== 'dark'"
    >
      <VaCardBlock
          style="width: 100%; height: 100%; display: flex;"
          class="flex-nowrap"
          horizontal
      >
        <VaImage
            src="https://source.unsplash.com/1920x1080/?nature"
            style="width: 50%; height: 100%"
        />
        <div class="login-card-right">
          <VaCardTitle style="font-size: 1.5rem">Login</VaCardTitle>
          <div class="login-inputs">
            <VaInput
                style="width: 60%"
                :placeholder="'Name'"
                label="Name"
                preset="bordered"
                :disabled="checking"
                :readonly="checking"
                v-model="name"
            >
              <template #prependInner>
                <Icon color="secondary">
                  <User/>
                </Icon>
              </template>
            </VaInput>

            <VaInput
                style="width: 60%"
                :placeholder="'Password'"
                label="Password"
                type="password"
                preset="bordered"
                :disabled="checking"
                :readonly="checking"
                v-model="pass"
            >
              <template #prependInner>
                <Icon color="secondary">
                  <Key/>
                </Icon>
              </template>
            </VaInput>

            <VaButton
                :disabled="checking"
                :loading="checking"
                style="margin-top: 50px"
                @click="login">
              Next
            </VaButton>
          </div>
        </div>
      </VaCardBlock>
    </VaCard>
  </div>
</template>

<style scoped>
.login-card {
  width: 60%;
  height: 50%;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: start;
  gap: 1rem;
}

.login-card-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 1rem;
}

.login-inputs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
</style>