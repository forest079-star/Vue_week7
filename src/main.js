import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'
// 加入 CKEditor
import CKEditor from '@ckeditor/ckeditor5-vue'

import './style.css'
import './assets/all.scss'
import App from './App.vue'
import router from './router'

// custom plugin
import { date } from './methods/filters'

const pinia = createPinia()

const app = createApp(App)

app
  .provide('$filters', { date })
  .use(pinia)
  .use(router)
  .use(CKEditor)
  // .use(Swal)
  .use(VueAxios, axios)

app.mount('#app')
