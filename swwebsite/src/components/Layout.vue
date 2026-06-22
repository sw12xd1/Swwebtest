<template>
  <div class="common-layout">
    <el-container class="main-container">
        <SideBar />
      <el-container>
        <el-header>
            <NavBar />
        </el-header>
        <el-main class="main-content">
            <router-view v-slot="{ Component }">
              <transition name="fade-slide" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script setup>
import SideBar from './SideBar.vue';
import NavBar from './NavBar.vue';
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #e0f2fe 50%, #d1f2eb 75%, #cce5ff 100%);
  .el-header {
    height: 71.4px !important;
    background: transparent;
  }
  .main-content {
    overflow: hidden;
    background: transparent;
    padding: 20px;
  }
  .main-container {
    height:100%;
    background: transparent;
  }
}

/* 路由切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>