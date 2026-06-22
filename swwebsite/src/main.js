import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).use(ElementPlus).use(pinia).mount('#app')

// 根据屏幕宽度自动切换电脑版/手机版
const isMobile = () => window.innerWidth < 768

router.beforeEach((to, from, next) => {
  const mobile = isMobile()
  const goingToMobile = to.path.startsWith('/m')
  const goingToDesktop = !goingToMobile && to.path !== '/'
  const atRoot = to.path === '/' || to.path === ''

  if (atRoot) {
    // 根路径重定向
    return next(mobile ? '/m/bisai' : '/dashboard')
  }

  if (mobile && goingToDesktop) {
    // 手机访问电脑版 → 跳转手机版
    const map = { '/dashboard': '/m/bisai', '/sleep': '/m/sleep', '/diary': '/m/diary', '/tasklist': '/m/task' }
    return next(map[to.path] || '/m/bisai')
  }

  if (!mobile && goingToMobile) {
    // 电脑访问手机版 → 跳转电脑版
    const map = { '/m/bisai': '/dashboard', '/m/sleep': '/sleep', '/m/diary': '/diary', '/m/task': '/tasklist' }
    return next(map[to.path] || '/dashboard')
  }

  next()
})
