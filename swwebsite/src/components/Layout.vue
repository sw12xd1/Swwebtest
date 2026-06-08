<template>
  <div class="common-layout">
    <el-container class="main-container">
        <SideBar />
      <el-container>
        <el-header>
            <NavBar />
        </el-header>
        <el-main class="main-content">
            <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>r

  </div>
</template>

<script setup>
import SideBar from './SideBar.vue';
import NavBar from './NavBar.vue';
</script>

<style lang="scss" scoped>
.common-layout {
   height: 100vh;
  .el-header {
    height: 71.4px !important;
  }
  .main-container {
    height:100%;
    .content-container {
      padding: 20px;
      background: #fff;
      min-height: calc(100% - 71.4px);
    }
  }
}
</style>