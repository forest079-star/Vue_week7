import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'

import './style.css'
import './assets/all.scss'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(VueAxios, axios)

app.mount('#app')
