<template>
  <div class="m-page">
    <div class="m-add-bar">
      <el-input v-model.trim="draft" placeholder="写下要做的事…" size="small" @keyup.enter="addTask" />
      <el-select v-model="draftPriority" size="small" style="width: 70px">
        <el-option label="紧急" value="urgent" />
        <el-option label="计划" value="plan" />
        <el-option label="忙碌" value="busy" />
        <el-option label="空闲" value="free" />
      </el-select>
      <el-button type="primary" size="small" :disabled="!draft" @click="addTask">添加</el-button>
    </div>

    <div class="m-filters">
      <el-radio-group v-model="filter" size="small">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="active">待办</el-radio-button>
        <el-radio-button value="done">已完成</el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="visibleTasks.length === 0" class="m-empty">暂无任务</div>

    <div class="m-list">
      <div
        v-for="task in visibleTasks"
        :key="task.id"
        class="m-task-card"
        :class="[{ done: task.status }, `p-${task.priority}`]"
      >
        <div class="m-task-row">
          <el-checkbox
            v-model="task.status"
            :true-value="1"
            :false-value="0"
            :disabled="task.status === 1"
            @change="(checked) => changeStatus(task, checked)"
          />
          <div class="m-task-body">
            <p class="m-task-text" :class="{ done: task.status }">{{ task.text }}</p>
            <span class="m-task-meta">
              <el-tag :type="tagType(task.priority)" size="small" effect="plain" round>
                {{ label(task.priority) }}
              </el-tag>
              <span v-if="task.deadline" class="m-deadline" :class="{ overdue: isOverdue(task) }">
                {{ task.deadline }}
              </span>
            </span>
          </div>
          <div class="m-task-btns">
            <el-button link :icon="Edit" size="small" @click="taskDialogRef.open(task)" />
            <el-button link :icon="Close" size="small" @click="removeTask(task.id)" />
          </div>
        </div>
      </div>
    </div>

    <taskDialog ref="taskDialogRef" @updated="fetchData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import adminApi from '@/api/admin.js'
import taskDialog from '@/components/taskDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Close } from '@element-plus/icons-vue'

const draft = ref('')
const draftPriority = ref('plan')

function formatDate(d = new Date()) {
  const date = d instanceof Date ? d : new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const addTask = async () => {
  if (!draft.value) return
  try {
    await adminApi.createTask({ text: draft.value, status: 0, created_at: formatDate(), deadline: '', priority: draftPriority.value })
    ElMessage.success('新增成功')
    draft.value = ''
    await fetchData()
  } catch (err) {
    ElMessage.error('新增失败')
  }
}

const filter = ref('all')
const visibleTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => !t.status)
  if (filter.value === 'done') return tasks.value.filter(t => t.status)
  return tasks.value
})

const tasks = ref([])
const loaded = ref(false)

const fetchData = async () => {
  try {
    const res = await adminApi.getTasks()
    tasks.value = res.data
  } catch (err) { console.error(err) }
  finally { loaded.value = true }
}

const changeStatus = async (task, checked) => {
  const old = task.status
  try {
    await adminApi.updateTaskStatus(task.id, { status: checked ? 1 : 0 })
    await fetchData()
    ElMessage.success('搞定！')
  } catch (err) {
    task.status = old
    ElMessage.error('更新失败')
  }
}

const removeTask = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除吗?', '提示', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' })
    await adminApi.deleteTask(id)
    await fetchData()
    ElMessage.success('删除成功')
  } catch { /* cancelled */ }
}

const taskDialogRef = ref(null)

function isOverdue(task) {
  if (task.status || !task.deadline) return false
  return task.deadline < formatDate()
}

const meta = {
  urgent: { label: '紧急', tag: 'danger' },
  plan: { label: '计划', tag: 'primary' },
  busy: { label: '忙碌', tag: 'warning' },
  free: { label: '空闲', tag: 'success' },
}
function label(p) { return meta[p]?.label || p }
function tagType(p) { return meta[p]?.tag || 'info' }

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.m-page { padding-bottom: 16px; background: transparent; }
.m-add-bar { display: flex; gap: 6px; margin-bottom: 12px; }
.m-filters { display: flex; justify-content: center; margin-bottom: 12px; }
.m-empty { text-align: center; color: #909399; padding: 40px 0; }
.m-list { display: flex; flex-direction: column; gap: 8px; }
.m-task-card { background: #fff; border-radius: 12px; padding: 12px 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-left: 4px solid #dcdfe6; }
.m-task-card.p-urgent { border-left-color: #f56c6c; }
.m-task-card.p-plan { border-left-color: #409eff; }
.m-task-card.p-busy { border-left-color: #e6a23c; }
.m-task-card.p-free { border-left-color: #67c23a; }
.m-task-card.done { opacity: 0.6; }
.m-task-row { display: flex; align-items: flex-start; gap: 10px; }
.m-task-body { flex: 1; min-width: 0; }
.m-task-text { margin: 0; font-size: 14px; color: #303133; line-height: 1.4; word-break: break-word; }
.m-task-text.done { text-decoration: line-through; color: #b0a898; }
.m-task-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.m-deadline { font-size: 11px; color: #909399; }
.m-deadline.overdue { color: #f56c6c; font-weight: 600; }
.m-task-btns { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
</style>
