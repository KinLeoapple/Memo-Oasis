import { createVuestic } from 'vuestic-ui'
import config from '../vuestic.config.js'
import 'vuestic-ui/css'
import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
    .use(createVuestic({ config }))
    .mount('#app')
