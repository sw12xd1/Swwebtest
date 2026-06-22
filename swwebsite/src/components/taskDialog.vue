<template>
  <el-dialog
    v-model="visible"
    title="编辑任务"
    width="420px"
    :close-on-click-modal="false"
    class="task-dialog"
  >
    <div class="form">

        <el-input v-model="form.text" placeholder="任务内容" class="form-input" />

        <div class="form-row">
            <el-select v-model="form.priority" class="form-priority">
                <el-option label="紧急" value="urgent" />
                <el-option label="计划" value="plan" />
                <el-option label="忙碌" value="busy" />
                <el-option label="空闲" value="free" />
            </el-select>

            <el-date-picker
            v-model="form.deadline"
            type="date"
            placeholder="截止日期"
            format="MM-DD"
            value-format="YYYY-MM-DD"
            clearable
            class="form-deadline"
            />
        </div>

        <div class="form-status">
            <span class="status-label">状态</span>
            <el-radio-group v-model="form.status">
                <el-radio :value="0">待办</el-radio>
                <el-radio :value="1">已完成</el-radio>
            </el-radio-group>
        </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </template>
    
  </el-dialog>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import adminApi from '@/api/admin.js'

const emit = defineEmits(['updated'])

const visible = ref(false)
const form = reactive({ id: null, text: '', priority: 'plan', deadline: '', created_at: '', status: 1 })

const open = (task) => {
  form.id         = task.id
  form.text       = task.text
  form.priority   = task.priority
  form.deadline   = task.deadline || ''
  form.created_at = task.created_at
  form.status     = task.status
  visible.value   = true
}

const submit = async () => {
  if (!form.text.trim()) return ElMessage.warning('任务内容不能为空')
  try {
    await adminApi.updateTask(form.id, {
      text:       form.text,
      priority:   form.priority,
      deadline:   form.deadline || null,
      created_at: form.created_at,
      status:     form.status, 
    })
    ElMessage.success('更新成功')
    visible.value = false
    emit('updated')
  } catch (err) {
    console.error(err)
    ElMessage.error('更新失败')
  }
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  :deep(.el-radio-group) {
    display: inline-flex;
    flex-shrink: 0;
  }
}

.status-label {
  font-size: 13px;
  color: #8c8378;
  flex-shrink: 0;
  padding: 0 10px 0;
}

.form-input { width: 100%; }
.form-priority { width: 110px; flex-shrink: 0; }
.form-deadline { flex: 1; }
</style>