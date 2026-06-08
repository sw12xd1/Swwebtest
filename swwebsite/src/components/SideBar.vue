<template>
    <el-aside :width="isCollapsed ? '64px' : '200px'">
      <el-menu
        class="menu-style"
        default-active="2"
        :collapse="isCollapsed"
        :collapse-transition="false"

      >
      <div class="brand">
        <el-image style="width: 50px; height: 50px;" :src="IconUrl" />
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
console.log(router)
const IconUrl = new URL('@/assets/images/logo.png', import.meta.url).href

const selectMenu = (key) => {
  // const currentRoutes = router.options.routes[0]
  router.push(`/${key.index}`)
}




</script>

<style scoped lang="scss">
.menu-style {
    height: 100%;
    .brand{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-bottom: 1px solid #e5e7eb;
    }
    .brand-text{
        font-size: 20px;
        margin-left: 7px;
    }
}
</style>
