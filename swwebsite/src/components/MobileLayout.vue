<template>
  <div class="mobile-layout">
    <header class="mobile-header">
      <h1 class="mobile-title">{{ pageTitle }}</h1>
    </header>
    <main class="mobile-main">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
  position: relative;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #e0f2fe 50%, #d1f2eb 75%, #cce5ff 100%);
  padding-bottom: 56px;
}

.mobile-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #e0f2fe 50%, #d1f2eb 75%, #cce5ff 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.mobile-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: #1e3a5f;
  animation: textIn 0.5s ease both;
}

.mobile-main {
  padding: 12px;
}

.mobile-tabs {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #e0f2fe 50%, #d1f2eb 75%, #cce5ff 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding: 6px 0 env(safe-area-inset-bottom, 6px);
  z-index: 100;
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

/* 标题文字动画 */
@keyframes textIn {
  from { opacity: 0; transform: translateY(-8px); letter-spacing: 4px; }
  to   { opacity: 1; transform: translateY(0);   letter-spacing: 0; }
}

/* 卡片入场逐行动画 */
.mobile-main :deep(.m-card),
.mobile-main :deep(.m-task-card) {
  animation: cardIn 0.4s ease both;
}
@for $i from 1 through 20 {
  .mobile-main :deep(.m-list > *:nth-child(#{$i})) {
    animation-delay: #{$i * 0.06}s;
  }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片内文字逐行动画 */
.mobile-main :deep(.m-card-head),
.mobile-main :deep(.m-card-info),
.mobile-main :deep(.m-card-tags),
.mobile-main :deep(.m-indicators),
.mobile-main :deep(.m-content),
.mobile-main :deep(.m-ai),
.mobile-main :deep(.m-task-row) {
  animation: lineIn 0.35s ease both;
}
.mobile-main :deep(.m-card-head)        { animation-delay: 0.08s; }
.mobile-main :deep(.m-card-info)        { animation-delay: 0.14s; }
.mobile-main :deep(.m-card-tags)        { animation-delay: 0.2s; }
.mobile-main :deep(.m-indicators)       { animation-delay: 0.14s; }
.mobile-main :deep(.m-content)          { animation-delay: 0.2s; }
.mobile-main :deep(.m-ai)               { animation-delay: 0.26s; }
.mobile-main :deep(.m-card-actions)     { animation-delay: 0.3s; }
.mobile-main :deep(.m-task-row)         { animation-delay: 0.1s; }

@keyframes lineIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
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
