<template>
  <el-card class="board" :body-style="{ padding: '28px 24px 40px' }" shadow="never">
    <div class="tape tape-header"></div>

    <span class="pencil" aria-hidden="true">
      <span class="pencil-eraser"></span>
      <span class="pencil-ferrule"></span>
      <span class="pencil-body"></span>
      <span class="pencil-wood"></span>
      <span class="pencil-tip"></span>
    </span>

    <header class="board-header">
      <h1 class="title">案头清单</h1>
      <p class="subtitle">{{ today }} · 共 {{ tasks.length }} 项 · 已完成 {{ doneCount }} 项</p>
    </header>

    <div class="add-row">
      <el-input
        v-model.trim="draft"
        placeholder="写下要做的事…"
        class="add-input"
        @keyup.enter="addTask"
      />
      <el-select v-model="draftPriority" class="add-priority">
        <el-option label="急" value="urgent" />
        <el-option label="计划" value="plan" />
        <el-option label="忙碌" value="busy" />
        <el-option label="空闲" value="free" />
      </el-select>
      <!-- ✅ 新增：deadline 日期选择器 -->
      <el-date-picker
        v-model="draftDeadline"
        type="date"
        placeholder="截止日期"
        format="MM-DD"
        value-format="YYYY-MM-DD"
        class="add-deadline"
        clearable
      />
      <el-button class="add-btn" :disabled="!draft" @click="addTask">添加</el-button>
    </div>

    <div class="filters">
      <el-radio-group v-model="filter" size="small">
        <el-radio-button v-for="f in filters" :key="f.key" :value="f.key">
          {{ f.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <transition-group v-loading="loading" tag="ul" name="card" class="list">
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
              @change="toggleDone(task)"
            />

            <div class="card-body">
              <p class="card-text" :class="{ done: task.done }">{{ task.title }}</p>
              <span class="card-meta">
                <el-tag :type="priorityTagType(task.priority)" size="small" effect="plain" round>
                  {{ priorityLabel(task.priority) }}
                </el-tag>
                <!-- ✅ 新增：显示 deadline -->
                <span v-if="task.deadline" class="card-deadline" :class="{ overdue: isOverdue(task) }">
                  <el-icon><Calendar /></el-icon>
                  {{ task.deadline }}
                </span>
                <span class="card-date">{{ task.created_at }}</span>
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

    <el-empty v-if="visibleTasks.length === 0" description="这里空空如也，写下第一件要做的事吧。" :image-size="64" />
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Close, Calendar } from '@element-plus/icons-vue'
import adminApi from '../api/admin.js'

const api = axios.create({ baseURL: '/api/task' })

const today = new Date().toLocaleDateString('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})

const draft = ref('')
const draftPriority = ref('plan')
const draftDeadline = ref('')   // ✅ 新增
const filter = ref('all')
const loading = ref(false)

const filters = [
  { key: 'all',    label: '全部' },
  { key: 'active', label: '待办' },
  { key: 'done',   label: '已完成' },
]

const priorityMeta = {
  urgent: { label: '急',  tag: 'danger'  },
  plan:   { label: '计划', tag: 'primary' },
  busy:   { label: '忙碌', tag: 'warning' },
  free:   { label: '空闲', tag: 'success' },
}

const tasks = ref([])

function formatDate(d = new Date()) {
  const date = d instanceof Date ? d : new Date(d)
  const y  = date.getFullYear()
  const m  = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ✅ 修复：row.text（对应后端字段），补充 deadline 映射
async function fetchTasks() {
  loading.value = true
  try {
    const { data } = await adminApi.getTask({ params: { page: 1, pageSize: 100 } })
    tasks.value = (data?.data || []).map((row) => ({
      id:         row.id,
      title:      row.text,                                     // ✅ 修复：text → title
      priority:   row.priority,
      done:       !!row.status,
      created_at: row.created_at ? row.created_at.slice(0, 10) : '',
      deadline:   row.deadline   ? row.deadline.slice(0, 10)   : '',  // ✅ 新增
    }))
  } catch (err) {
    console.error(err)
    ElMessage.error('任务列表加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)

// ✅ 修复：传递 deadline 字段
async function addTask() {
  if (!draft.value) return
  try {
    await adminApi.createTask({
      text:       draft.value,
      status:     0,
      priority:   draftPriority.value,
      created_at: formatDate(),
      deadline:   draftDeadline.value || null,   // ✅ 新增
    })
    draft.value     = ''
    draftDeadline.value = ''                     // ✅ 重置
    await fetchTasks()
  } catch (err) {
    console.error(err)
    ElMessage.error('新增失败')
  }
}

async function removeTask(id) {
  try {
    await api.delete(`/${id}`)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  } catch (err) {
    console.error(err)
    ElMessage.error('删除失败')
  }
}

// ✅ 修复：同步 deadline 到后端
async function toggleDone(task) {
  const next = task.done
  try {
    await api.put(`/${task.id}`, {
      text:       task.title,
      status:     next ? 1 : 0,
      priority:   task.priority,
      created_at: task.created_at,
      deadline:   task.deadline || null,   // ✅ 新增
    })
  } catch (err) {
    console.error(err)
    ElMessage.error('更新失败')
    task.done = !next
  }
}

// ✅ 新增：判断是否已逾期（未完成且截止日期早于今天）
function isOverdue(task) {
  if (task.done || !task.deadline) return false
  return task.deadline < formatDate()
}

function priorityLabel(p)   { return priorityMeta[p]?.label || p }
function priorityTagType(p) { return priorityMeta[p]?.tag   || 'info' }

const doneCount = computed(() => tasks.value.filter((t) => t.done).length)

const visibleTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.done)
  if (filter.value === 'done')   return tasks.value.filter((t) =>  t.done)
  return tasks.value
})
</script>

<style scoped>
.board {
  --paper: #fbf6ee;
  --paper-edge: #f1e8d8;
  --ink: #2e2a24;
  --ink-soft: #8c8378;
  --line: #e4dac9;
  --tape-urgent: #c9684e;
  --tape-plan: #7a93b3;
  --tape-busy: #d9a24b;
  --tape-free: #93a382;

  max-width: 480px;
  margin: 0 auto;
  position: relative;
  background: var(--paper) !important;
  background-image: linear-gradient(var(--line) 1px, transparent 1px) !important;
  background-size: 100% 36px !important;
  border: 1px solid var(--line) !important;
  border-radius: 4px !important;
  box-shadow: 0 12px 30px -18px rgba(46, 42, 36, 0.45) !important;
  font-family: 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
  color: var(--ink);
}

/* ---- header ---- */
.board-header {
  position: relative;
  padding-top: 6px;
  margin-bottom: 18px;
}

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

.title {
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0;
  text-align: center;
}

.subtitle {
  margin: 6px 0 0;
  text-align: center;
  font-size: 12px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  color: var(--ink-soft);
  letter-spacing: 0.03em;
}

/* ---- add row ---- */
.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;  /* ✅ 新增：防止日期选择器撑破布局 */
}

.add-input {
  flex: 1;
  min-width: 140px;
}

.add-priority {
  width: 76px;
}

/* ✅ 新增：deadline 选择器宽度 */
.add-deadline {
  width: 130px;
}

.add-row :deep(.el-input__wrapper),
.add-row :deep(.el-select__wrapper),
.add-row :deep(.el-date-editor .el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  border: 1px dashed var(--line);
  border-radius: 4px;
}

.add-row :deep(.el-input__wrapper.is-focus),
.add-row :deep(.el-select__wrapper.is-focused),
.add-row :deep(.el-date-editor.is-active .el-input__wrapper) {
  border-color: var(--tape-plan);
}

.add-row :deep(input),
.add-row :deep(.el-select__placeholder) {
  color: var(--ink);
  font-family: inherit;
}

.add-btn {
  background: var(--ink) !important;
  color: var(--paper) !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.add-btn.is-disabled { opacity: 0.35 !important; }
.add-btn:not(.is-disabled):hover { opacity: 0.85; }

/* ---- filters ---- */
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
  border-radius: 999px !important;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.filters :deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: var(--paper-edge);
  color: var(--ink);
  border-color: var(--line) !important;
}

/* ---- list ---- */
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  position: relative;
  overflow: visible !important;
  background: #fffdf8 !important;
  border: 1px solid var(--line) !important;
  border-radius: 3px !important;
  box-shadow: 0 2px 6px -4px rgba(46, 42, 36, 0.3) !important;
}

.task-card .tape {
  top: -7px;
  left: 14px;
  width: 30px;
  height: 14px;
  transform: rotate(-3deg);
  z-index: 1;
}

.tape-urgent { background: var(--tape-urgent); }
.tape-plan   { background: var(--tape-plan);   }
.tape-busy   { background: var(--tape-busy);   }
.tape-free   { background: var(--tape-free);   }

.task-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

/* ---- pencil decoration ---- */
.pencil {
  position: absolute;
  bottom: 14px;
  right: -14px;
  display: flex;
  align-items: center;
  transform: rotate(-50deg) scale(1.6);
  transform-origin: right center;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.pencil-eraser  { width: 8px;  height: 9px; background: #e8927c; border: 1px solid #d97a64; border-radius: 2px 0 0 2px; }
.pencil-ferrule { width: 3px;  height: 9px; background: #d8d3cb; border-top: 1px solid #bfb9af; border-bottom: 1px solid #bfb9af; }
.pencil-body    {
  width: 36px; height: 9px;
  background: repeating-linear-gradient(to bottom, #f4c542 0 3px, #e8b73a 3px 4px, #f4c542 4px 9px);
  border-top: 1px solid #d9a92f; border-bottom: 1px solid #d9a92f;
}
.pencil-wood { width: 6px; height: 9px; background: #f1d9a8; border-top: 1px solid #d9a92f; border-bottom: 1px solid #d9a92f; }
.pencil-tip  { width: 0; height: 0; border-style: solid; border-width: 4.5px 0 4.5px 7px; border-color: transparent transparent transparent #4a3526; }

/* ---- stamp (checkbox) ---- */
.stamp { margin-top: 3px; }
.stamp :deep(.el-checkbox__inner) { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--ink-soft); }
.stamp :deep(.el-checkbox__inner)::after { left: 6px; top: 2px; }

.stamp-urgent :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-urgent) !important; border-color: var(--tape-urgent) !important; }
.stamp-plan   :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-plan)   !important; border-color: var(--tape-plan)   !important; }
.stamp-busy   :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-busy)   !important; border-color: var(--tape-busy)   !important; }
.stamp-free   :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-free)   !important; border-color: var(--tape-free)   !important; }

/* ---- card body ---- */
.card-body { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }

.card-text { margin: 0; font-size: 14px; line-height: 1.5; word-break: break-word; }
.card-text.done { color: var(--ink-soft); text-decoration: line-through; text-decoration-color: var(--tape-free); }

.card-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.card-date {
  font-size: 11px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  color: var(--ink-soft);
  letter-spacing: 0.03em;
}

/* ✅ 新增：deadline 样式 */
.card-deadline {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  color: var(--tape-plan);
  letter-spacing: 0.03em;
}

.card-deadline.overdue {
  color: var(--tape-urgent);
  font-weight: 600;
}

.remove-btn { margin-top: 2px; color: var(--ink-soft) !important; }
.remove-btn:hover { color: var(--tape-urgent) !important; }

/* ---- empty ---- */
:deep(.el-empty__description p) { color: var(--ink-soft); font-size: 13px; }

/* ---- transitions ---- */
.card-enter-active, .card-leave-active { transition: all 0.2s ease; }
.card-enter-from, .card-leave-to { opacity: 0; transform: translateY(-6px); }
</style>