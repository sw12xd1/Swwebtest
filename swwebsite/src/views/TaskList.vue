<template>
  <el-card class="board" :body-style="{ padding: '28px 24px 40px' }">
    <div class="tape tape-header"></div>

    <header class="board-header">
        <h1 class="title">任务清单</h1>
        <p class="subtitle">{{ today }} · 共 {{}} 项 · 已完成 {{}} 项</p>
    </header>
    
    <div class="add-row">
      <el-input
          v-model.trim="draft"
          placeholder="写下要做的事…"
          class="add-input"
          @keyup.enter="addTask"
          style="width: 300px"  
        />

        <el-select v-model="draftPriority" class="add-priority">
          <el-option label="急重" value="urgent" />
          <el-option label="重缓" value="plan" />
          <el-option label="急闲" value="busy" />
          <el-option label="闲" value="free" />
        </el-select>

        <el-button class="add-btn" :disabled="!draft" @click="addTask">添加</el-button>
    </div>


    <div class="filters">
      <el-radio-group v-model="filter" size="small">
        <el-radio-button v-for="f in filters" :key="f.key" :value="f.key">
          {{ f.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <transition-group tag="ul" name="card" class="list">
        <li v-for="task in visibleTasks" :key="task.id">
          <el-card
            class="task-card"
            :class="{ done: task.done }"
            shadow="hover"
            :body-style="{ padding: '12px 14px 12px 18px' }"
          >
            <span class="tape" :class="`tape-${task.priority}`"></span>
  
            <div class="task-row">
              <el-checkbox
                v-model="task.done"
                class="stamp"
                :class="`stamp-${task.priority}`"
              />
  
              <div class="card-body">
                <p class="card-text" :class="{ done: task.done }">{{ task.text }}</p>
                <span class="card-meta">
                  <el-tag :type="priorityTagType(task.priority)" size="small" effect="plain" round>
                    {{ priorityLabel(task.priority) }}
                  </el-tag>
                  <span class="card-date">{{ task.date }}</span>
                </span>
              </div>
  
              <el-button
                class="remove-btn"
                link
                :icon="Close"
                @click="removeTask(task.id)"
                aria-label="删除"
              />
            </div>
          </el-card>
        </li>
    </transition-group>

  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElCard } from 'element-plus'

const today = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
})

const draft = ref('')
const draftPriority = ref('urgent')

const addTask=()=>{}


// 过滤器
const filters = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '待办' },
    { key: 'done', label: '已完成' },
  ]
</script>

<style scoped lang="scss">
.board{
  --tape-mid: #d9a24b;

  margin: 0 auto;
  max-width: 650px;
  box-shadow: 0 12px 30px -18px rgba(46, 42, 36, 0.45) !important;
  position: relative;
  background: #fbf6ee !important;
  background-image: linear-gradient(#f2ece1 1px, transparent 1px) !important;
  background-size: 100% 36px !important;

  .tape {
    position: absolute;
    border-radius: 1px;
    opacity: 0.9;
  }
  .tape-header {
    top: -10px;
    left: 50%;
    transform: translateX(-50%) rotate(-2deg);
    width: 120px;
    height: 28px;
    background: repeating-linear-gradient(
      135deg,
      #e8c98f,
      #e8c98f 6px,
      #dfb96f 6px,
      #dfb96f 12px
    );
    opacity: 0.85;
    z-index: 1;
  }

  .board-header {
    position: relative;
    margin-bottom: 18px;
    .title{
      text-align: center;
      font-family: 'Noto Serif SC', 'Songti SC', serif;
      font-size: 26px;
    }
    .subtitle{
      margin: 6px 0 0;
      text-align: center;
      letter-spacing: 0.4em;
      color: #8c8378;
      font-size: 12px;
    }
  }

  // add task
  .add-row :deep(.el-input__wrapper), .add-row :deep(.el-select__wrapper) {
    background: transparent !important;
    border: 0.01px dashed #e4dac9;
    border-radius: 4px;
  }
  .add-row :deep(.el-input),
  .add-row :deep(.el-select) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .add-row :deep(.el-input__wrapper), 
  .add-row :deep(.el-select__wrapper) {
    background: transparent !important;
    box-shadow: none !important;
    border: 1px dashed #e4dac9 !important;
    border-radius: 4px !important;
  }

  .add-row :deep(.el-input__wrapper.is-focus),
  .add-row :deep(.el-select__wrapper.is-focus) {
    border-color: #d9c8a8 !important;
    box-shadow: none !important;
  }
  .add-row {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    justify-content: center;
  }
  .add-priority {
    width: 85px;
  }
  .add-input {
  }

  // filters
  .filters {
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
  }
  .filters :deep(.el-radio-button__inner) {
    background: transparent;
    border: 1px solid transparent !important;
    color: var(--ink-soft);
    box-shadow: none !important;
    /* 关键：超大圆角 → 变圆形/胶囊 */
    border-radius: 999px !important;
    font-size: 12px;
    letter-spacing: 0.05em;
  }

  .filters :deep(.el-radio-button.is-active .el-radio-button__inner) {
    background: var(--paper-edge);
    color: var(--ink);
    border-color: var(--line) !important;
  }
}
  
</style>