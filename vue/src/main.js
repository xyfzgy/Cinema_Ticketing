import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { clearAuth } from './utils/auth'

// 每次重新启动前端都要求重新登录，避免后端重启后继续携带旧 token。
clearAuth()

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

app.mount('#app')
