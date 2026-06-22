<template>
  <div class="mobile-layout">
    <header class="mobile-header">
      <h1 class="mobile-title">{{ pageTitle }}</h1>
    </header>
    <main class="mobile-main">
      <router-view />
    </main>
    <nav class="mobile-tabs">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tab-item"
        active-class="tab-active"
      >
        <el-icon :size="22"><component :is="tab.icon" /></el-icon>
        <span class="tab-label">{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/m/bisai',   label: '鼻塞', icon: 'PieChart' },
  { path: '/m/sleep',   label: '睡眠', icon: 'Avatar' },
  { path: '/m/diary',   label: '日记', icon: 'Notebook' },
  { path: '/m/task',    label: '任务', icon: 'List' },
]

const pageTitle = computed(() => {
  const t = tabs.find(t => route.path.startsWith(t.path))
  return t ? t.label + '分析' : 'SW'
})
</script>

<style scoped lang="scss">
.mobile-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  background: #f5f5f5;
}

.mobile-header {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.mobile-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: #303133;
}

.mobile-main {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.mobile-tabs {
  display: flex;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 6px 0 env(safe-area-inset-bottom, 6px);
  flex-shrink: 0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 0;
  text-decoration: none;
  color: #909399;
  transition: color 0.2s;
}

.tab-active {
  color: #409eff;
}

.tab-label {
  font-size: 10px;
}
</style>
