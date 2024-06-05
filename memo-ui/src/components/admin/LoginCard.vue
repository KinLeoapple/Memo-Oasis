<script setup>
import background from "@/assets/img/login-background.webp";
import GoBackButton from "@/components/button/GoBackButton.vue";
import {Icon} from "@vicons/utils";
import {User} from "@vicons/fa";
import {Key} from "@vicons/fa";
import {crypt_str} from "@/assets/js/crypt.js";
import {computed, nextTick, ref} from "vue";
import {post_login} from "@/assets/js/api.js";

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
const token = ref(null);
const isLogin = ref(false);
const isChecking = ref(false);

const checking = computed({
  get() {
    return isChecking.value
  },
  set(value) {
    isChecking.value = value;
  }
})

const login = async () => {
  checking.value = true;
  post_login(name.value, pass.value).then(r => {
    if (r !== null) {
      token.value = r.login;
      localStorage.setItem("token", token.value);
      isLogin.value = token.value !== null;
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

defineExpose({isLogin, token});
</script>

<template>
  <div style="height: 100%; width: 100%">
    <router-link to="/" replace>
      <GoBackButton class="ml-3 mt-3" style="position: fixed; background-color: hsl(230 12% 15% / .8)"/>
    </router-link>

    <VaCard
        class="login-card overflow-hidden"
        :outlined="theme === 'dark'"
        :bordered="theme !== 'dark'"
    >
      <VaCardBlock
          style="width: 100%; height: 100%; display: flex;"
          class="flex-nowrap"
          horizontal
      >
        <VaImage
            :src="background"
            style="width: 50%; height: 100%"
            lazy
        />
        <div class="login-card-right">
          <VaCardTitle style="font-size: 1.5rem">Login</VaCardTitle>
          <div class="login-inputs-container">
            <div class="login-inputs">
              <VaInput
                  background="transparent"
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

              <VaValue
                  v-slot="isPasswordVisible"
                  :default-value="false"
              >
                <VaInput
                    background="transparent"
                    style="width: 60%"
                    :placeholder="'Password'"
                    label="Password"
                    :type="isPasswordVisible.value ? 'text' : 'password'"
                    preset="bordered"
                    :disabled="checking"
                    :readonly="checking"
                    v-model="pass"
                    @click-append-inner="isPasswordVisible.value = !isPasswordVisible.value"
                >
                  <template #prependInner>
                    <Icon color="secondary">
                      <Key/>
                    </Icon>
                  </template>
                  <template #appendInner>
                    <VaIcon
                        :name="isPasswordVisible.value ? 'visibility_off' : 'visibility'"
                        size="small"
                        color="primary"
                        style="cursor: pointer !important;"
                    />
                  </template>
                </VaInput>
              </VaValue>
            </div>
            <div class="login-btn">
              <VaButton
                  :disabled="checking"
                  :loading="checking"
                  style="margin-top: 3rem"
                  @click="login">
                Next
              </VaButton>
            </div>
          </div>
        </div>
      </VaCardBlock>
    </VaCard>
  </div>
</template>

<style scoped>
.login-card {
  backdrop-filter: blur(10px) !important;
  background-color: rgb(131 131 145 / 24%) !important;
  width: 60%;
  height: 70%;
  position: absolute;
  margin: auto;
  top: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: start;
  gap: 1rem;
  transition: all 0.2s ease;
}

@media screen and (max-width: 1024px) {
  .login-card {
    min-width: 600px;
    min-height: 370px;
    backdrop-filter: blur(10px) !important;
    background-color: rgb(131 131 145 / 24%) !important;
    width: 60%;
    height: 50%;
    position: absolute;
    margin: auto;
    top: 5rem;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: start;
    gap: 1rem;
    transition: all 0.2s ease;
  }
}

.login-card-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 1rem;
}

.login-inputs-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.login-inputs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.login-btn {
  margin-bottom: 30px;
}
</style>