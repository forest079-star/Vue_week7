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
import { date, unixTime } from './methods/filters'

const pinia = createPinia()

const app = createApp(App)

// app.config.globalProperties.$filters = {
//   date,
//   currency,
// };

app
  .provide('$filters', { date, unixTime })
  .use(pinia)
  .use(router)
  .use(CKEditor)
  // .use(Swal)
  .use(VueAxios, axios)

app.mount('#app')

// 总的来说，如果你想在组件树中传递数据或方法，provide / inject 是一个好选择。如果你想在所有组件中都能访问某个属性或方法，可以使用 app.config.globalProperties。请根据你的具体需求选择合适的方法。
