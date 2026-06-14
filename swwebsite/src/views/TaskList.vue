<template>
  <el-card class="board" :body-style="{ padding: '28px 24px 40px' }" shadow="never">
    <div class="tape tape-header"></div>

    <header class="board-header">
        <h1 class="title">任务清单</h1>
        <p class="subtitle">{{ today }} · 共 {{ tasks.length }} 项 · 已完成 {{ doneCount }} 项</p>
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
          <el-option label="紧急" value="urgent" />
          <el-option label="计划" value="plan" />
          <el-option label="忙碌" value="busy" />
          <el-option label="空闲" value="free" />
        </el-select>

        <el-date-picker
          v-model="draftDeadline"
          type="date"
          placeholder="截止日期"
          format="MM-DD"
          value-format="YYYY-MM-DD"
          class="add-deadline"
          clearable
          style="width:150px"
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

    <transition-group tag="ul" name="card" class="list">
        <li v-for="task in visibleTasks" :key="task.id">
          <el-card
            class="task-card"
            :class="[{ done: task.status}, `priority-${task.priority}`]"
            shadow="hover"
            :body-style="{ padding: '12px 14px 12px 18px'}"
            style="border-radius: 14px !important;"
          >
            <span class="tape" :class="`tape-${task.priority}`"></span>
  
            <div class="task-row">
              <el-checkbox
                v-model="task.status"
                :true-value="1"
                :false-value="0"
                class="stamp"
                :disabled="task.status === 1"
                :class="`stamp-${task.priority}`"
                @change="(checked) => changeStatus(task, checked)"
              />
              
              <div class="card-body">
                <p class="card-text" :class="{ done: task.status }">{{ task.text }}</p>
                <span class="card-meta">
                  <el-tag :type="priorityTagType(task.priority)" size="small" effect="plain" round>
                    {{ priorityLabel(task.priority) }}
                  </el-tag>

                  <span v-if="task.deadline" class="card-deadline" :class="{ overdue: isOverdue(task) }">
                    截止：{{ task.deadline }}
                  </span>

                </span>
              </div>
              
              <el-button
                class="edit-btn"
                link
                :icon="Edit"
                @click="taskDialogRef.open(task)"
              />

              <el-button
                class="remove-btn"
                link
                :icon="Close"
                @click="removeTask(task.id)"
              />
            </div>
          </el-card>
        </li>
    </transition-group>


    <el-empty v-if="loaded && visibleTasks.length === 0" description="这里空空如也，写下第一件要做的事吧。" :image-size="64" />
    <taskDialog ref="taskDialogRef" @updated="fetchData" />
    
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElCard, ElMessage, ElMessageBox } from 'element-plus'
import adminApi from '@/api/admin.js'
import { Close } from '@element-plus/icons-vue' 
import taskDialog from '@/components/taskDialog.vue'
import { Edit } from '@element-plus/icons-vue'

const draft = ref('')
const draftPriority = ref('plan')
const draftDeadline = ref('')

function formatDate(d = new Date()) {
  const date = d instanceof Date ? d : new Date(d)
  const y  = date.getFullYear()
  const m  = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const today = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
})


// 提交数据
const addTask = async () => {
  if (!draft.value) return
  try {
    await adminApi.createTask({
      text: draft.value,
      status: 0,
      created_at: formatDate(),
      deadline: draftDeadline.value,
      priority: draftPriority.value
    }).then(res => {
      console.log(res)
    })
      ElMessage.success('新增成功')
      draft.value = ''
      draftDeadline.value = ''     
      await fetchData()
  } catch (err) {
    console.error(err)
    ElMessage.error('新增失败')
  }
}


// 过滤器
const filter = ref('all')

const filters = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '待办' },
    { key: 'done', label: '已完成' },
]

// 过滤器 计算
const visibleTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.status)
  if (filter.value === 'done')   return tasks.value.filter((t) =>  t.status)
  return tasks.value
})

// 已完成任务数量
const doneCount = computed(() => {
  return tasks.value.filter(item => item.status === 1).length
})

function isOverdue(task) {
  if (task.status || !task.deadline) return false
  return task.deadline < formatDate()
}

const priorityMeta = {
  urgent: { label: '紧急', tag: 'danger'  },  // 第一象限：重要且紧急 → 立即处理
  plan:   { label: '计划', tag: 'primary' },  // 第二象限：重要不紧急 → 计划安排、重点规划
  busy:   { label: '忙碌', tag: 'warning' },  // 第三象限：紧急不重要 → 临时琐事、被动忙碌
  free:   { label: '空闲', tag: 'success' },  // 第四象限：不重要不紧急 → 休闲放空、可放松处理
}

function priorityLabel(p)   { return priorityMeta[p]?.label || p }
function priorityTagType(p) { return priorityMeta[p]?.tag   || 'info' }

// 获取数据
const tasks = ref([])
const loaded = ref(false)

const fetchData = async () => {
  try{
    const res = await adminApi.getTasks()
    tasks.value = res.data
    console.log(tasks)
  }
  catch(err){
    console.error(err)
  } finally {
    loaded.value = true
  }
}

// 修改状态
const changeStatus = async (task, checked) => {
  const newStatus = checked ? 1 : 0
  const oldStatus = task.status
  try {
    // 调用接口更新数据库状态
    await adminApi.updateTaskStatus(task.id, { status: newStatus })
    await fetchData()
    ElMessage.success('这么叼？')
  } catch (err) {
    // 接口失败，回滚页面状态
    task.status = oldStatus
    console.error(err)
    ElMessage.error('状态更新失败')
  }
}

// 删除接口
const removeTask = async (id) => {
  try {
    await ElMessageBox.confirm(
      '真的要删除吗？',
      '提示',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await adminApi.deleteTask(id)
    await fetchData()
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('删除取消')
  }
}
// updateDialog
const taskDialogRef = ref(null)


onMounted(() => {
  fetchData()
})


</script>

<style scoped lang="scss">
.board{
  --tape-mid: #d9a24b;
  --tape-urgent: #c9684e;
  --tape-plan: #7a93b3;
  --tape-busy: #d9a24b;
  --tape-free: #93a382;

  margin: 0 auto;
  max-width: 650px;
  box-shadow: 0 12px 30px -18px rgba(46, 42, 36, 0.45) !important;
  position: relative;
  background: #fbf6ee !important;
  background-image: linear-gradient(#f2ece1 1.3px, transparent 1px) !important;
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
      margin: 8px 0 0;
      text-align: center;
      font-size: 12px;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      color: #68635a;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &::before,
      &::after {
        content: '';
        display: inline-block;
        width: 100px;
        height: 1px;
        background: #d4934e;
      }
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

  /* ---- list ---- */
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .list li {
    width: 100%;
  }

  .task-card {
    position: relative;
    overflow: visible !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 8px -3px rgba(46, 42, 36, 0.15) !important;
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 4px 14px -4px rgba(46, 42, 36, 0.22) !important;
    }
  }

  .task-card .tape {
    top: -7px;
    left: 14px;
    width: 30px;
    height: 14px;
    transform: rotate(-3deg);
    z-index: 1;
  }

  .task-card.priority-urgent {
    background: #fdf3f0 !important;
    border: 1px solid #e8c4b8 !important;
  }
  .task-card.priority-plan {
    background: #f0f4f9 !important;
    border: 1px solid #b8c9dc !important;
  }
  .task-card.priority-busy {
    background: #fdf6e8 !important;
    border: 1px solid #e0cfa0 !important;
  }
  .task-card.priority-free {
    background: #f2f6f1 !important;
    border: 1px solid #b8ccb4 !important;
  }
  .task-card .tape {
    top: -7px;
    left: 16px;
    width: 28px;
    height: 13px;
    transform: rotate(-2deg);
    z-index: 1;
  }

  /* ---- card body ---- */
  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .card-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
    color: #2e2a24;
  }
  .card-text.done {
    color: #b0a898;
    text-decoration: line-through;
    text-decoration-color: #93a382;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .card-date {
    font-size: 11px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    color: #b0a898;
  }

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

  .tape-urgent { background: var(--tape-urgent); }
  .tape-plan   { background: var(--tape-plan);   }
  .tape-busy   { background: var(--tape-busy);   }
  .tape-free   { background: var(--tape-free);   }

  .task-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .remove-btn {
    margin-left: auto;
    flex-shrink: 0;
    color: #72726b !important;
    transition: all 0.2s ease;

    &:hover {
      color: #c9684e !important;
      background: rgba(201, 104, 78, 0.08) !important;
      border-radius: 50% !important;
      transform: scale(1.15);
    }
  }
  /* ---- stamp (checkbox) ---- */
  .stamp { margin-top: 3px; }
  .stamp :deep(.el-checkbox__inner) { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--ink-soft); }
  .stamp :deep(.el-checkbox__inner)::after { left: 9px; top: 10px; }

  .stamp :deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
    opacity: 1 !important;
    cursor: default !important;
  }

  .stamp :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner)::after {
    border-color: #fff !important;
  }
  .stamp-urgent :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-urgent) !important; border-color: var(--tape-urgent) !important; }
  .stamp-plan   :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-plan)   !important; border-color: var(--tape-plan)   !important; }
  .stamp-busy   :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-busy)   !important; border-color: var(--tape-busy)   !important; }
  .stamp-free   :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: var(--tape-free)   !important; border-color: var(--tape-free)   !important; }

  .edit-btn {
    flex-shrink: 0;
    color: #72726b !important;
    transition: all 0.2s ease;

    &:hover {
      color: #7a93b3 !important;
      background: rgba(122, 147, 179, 0.08) !important;
      border-radius: 50% !important;
      transform: scale(1.15);
    }
  }

}


  
</style>