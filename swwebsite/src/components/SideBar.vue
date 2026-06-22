<template>
    <el-aside :width="isCollapsed ? '64px' : '200px'">
      <el-menu
        class="menu-style"
        default-active="2"
        :collapse="isCollapsed"
        :collapse-transition="false"

      >
      <div class="brand">
        <!-- <el-image style="width: 50px; height: 50px;" :src="IconUrl" /> -->
        <span v-show="!isCollapsed" class="brand-text">SWWebsite</span>
      </div>

      <el-menu-item @click="selectMenu" v-for="i in router.options.routes[0].children"
       :key="i.path"
       :index="i.path"
       >
          <el-icon><component :is="i.meta.icon" /></el-icon>
          <span>{{i.meta.title}}</span>
        </el-menu-item>
      
      </el-menu>
    </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'

const isCollapsed = computed(() => useAdminStore().isCollapsed)

const router = useRouter()
console.log("当前路由数据",router)
const IconUrl = new URL('@/assets/images/logo.png', import.meta.url).href

const selectMenu = (key) => {
  // const currentRoutes = router.options.routes[0]
  router.push(`/${key.index}`)
}




</script>

<style scoped lang="scss">
.el-aside {
  background: transparent !important;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
}
.menu-style {
    height: 100%;
    background: transparent !important;
    border-right: none !important;
    .brand{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        height: 51.4px;
    }
    .brand-text{
        font-size: 20px;
        margin-left: 7px;
        color: #1e3a5f;
        font-weight: 600;
    }
}
/* el-menu-item 默认白色背景覆盖掉 */
.menu-style :deep(.el-menu-item) {
  background: transparent !important;
}
.menu-style :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.35) !important;
}
.menu-style :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.5) !important;
}
</style>
