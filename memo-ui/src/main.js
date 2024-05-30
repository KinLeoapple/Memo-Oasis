import { createVuestic } from 'vuestic-ui'
import config from '../vuestic.config.js'
import 'vuestic-ui/css'
import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from "@/router.js";

const app = createApp(App)
    .use(router)
    .use(createVuestic({ config }))
    .mount('#app')
