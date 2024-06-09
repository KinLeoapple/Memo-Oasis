<script setup>
import GoBackButton from "@/components/button/GoBackButton.vue";
import {Icon} from "@vicons/utils";
import {User} from "@vicons/fa";
import {Key} from "@vicons/fa";
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
  <div>
    <router-link to="/" replace>
      <GoBackButton class="ml-3 mt-3" style="position: fixed; background-color: hsl(230 12% 15% / .8)"/>
    </router-link>

    <VaCard
        class="login-card overflow-hidden"
        :outlined="theme === 'dark'"
        :bordered="theme !== 'dark'"
    >
      <VaCardTitle class="va-title" style="text-shadow: 0 0 10px var(--va-text-primary)">
        <span class="va-text-capitalize"
              style="font-size: 3rem; letter-spacing: 1px">
          Sign In
        </span>
      </VaCardTitle>
      <VaCardBlock
          style="width: 100%; height: 100%; display: flex;"
          class="flex-nowrap"
          horizontal
      >
        <div class="login-card-left">
          <div class="loader">
            <div class="wrapper">
              <div class="catContainer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 733 673"
                    class="catbody"
                >
                  <path
                      fill="#212121"
                      d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"
                  ></path>
                  <path fill="#212121" d="M184 9L270.603 159H97.3975L184 9Z"></path>
                  <path fill="#212121" d="M541 0L627.603 150H454.397L541 0Z"></path>
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 158 564"
                    class="tail"
                >
                  <path
                      fill="#191919"
                      d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"
                  ></path>
                </svg>
                <div class="text">
                  <span class="bigzzz">Z</span>
                  <span class="zzz">Z</span>
                </div>
              </div>
              <div class="wallContainer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 500 126"
                    class="wall"
                >
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="3"
                      x2="450"
                      y1="3"
                      x1="50"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="85"
                      x2="400"
                      y1="85"
                      x1="100"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="122"
                      x2="375"
                      y1="122"
                      x1="125"
                  ></line>
                  <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="500" y1="43"></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="1.99391"
                      x2="115.5"
                      y1="43.0061"
                      x1="115.5"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="2.00002"
                      x2="189"
                      y1="43.0122"
                      x1="189"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="2.00612"
                      x2="262.5"
                      y1="43.0183"
                      x1="262.5"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="2.01222"
                      x2="336"
                      y1="43.0244"
                      x1="336"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="2.01833"
                      x2="409.5"
                      y1="43.0305"
                      x1="409.5"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="43"
                      x2="153"
                      y1="84.0122"
                      x1="153"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="43"
                      x2="228"
                      y1="84.0122"
                      x1="228"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="43"
                      x2="303"
                      y1="84.0122"
                      x1="303"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="43"
                      x2="378"
                      y1="84.0122"
                      x1="378"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="84"
                      x2="192"
                      y1="125.012"
                      x1="192"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="84"
                      x2="267"
                      y1="125.012"
                      x1="267"
                  ></line>
                  <line
                      stroke-width="6"
                      stroke="#7C7C7C"
                      y2="84"
                      x2="342"
                      y1="125.012"
                      x1="342"
                  ></line>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="login-card-right">
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
  align-items: center;
  justify-content: start;
  gap: 1rem;
  transition: all 0.2s ease;
}

@media screen and (max-width: 1024px) {
  .login-card {
    min-width: 600px;
    min-height: 400px;
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
    align-items: center;
    justify-content: start;
    gap: 1rem;
    transition: all 0.2s ease;
  }
}

.login-card-left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
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

.loader {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper {
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.catContainer {
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.catbody {
  width: 80px;
}

.tail {
  position: absolute;
  width: 17px;
  top: 50%;
  animation: tail 0.5s ease-in infinite alternate-reverse;
  transform-origin: top;
}

@keyframes tail {
  0% {
    transform: rotateZ(60deg);
  }
  50% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(-20deg);
  }
}

.wall {
  width: 300px;
}

.text {
  display: flex;
  flex-direction: column;
  width: 50px;
  position: absolute;
  margin: 0px 0px 100px 120px;
}

.zzz {
  color: black;
  font-weight: 700;
  font-size: 15px;
  animation: zzz 2s linear infinite;
}

.bigzzz {
  color: black;
  font-weight: 700;
  font-size: 25px;
  margin-left: 10px;
  animation: zzz 2.3s linear infinite;
}

@keyframes zzz {
  0% {
    color: transparent;
  }
  50% {
    color: black;
  }
  100% {
    color: transparent;
  }
}

</style>