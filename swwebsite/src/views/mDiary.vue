<template>
  <div class="m-page">
    <div class="m-toolbar">
      <el-button type="primary" size="small" @click="handleEdit({})">新增</el-button>
    </div>

    <div v-if="tableData.length === 0" class="m-empty">暂无数据</div>

    <div class="m-list">
      <div v-for="row in tableData" :key="row.id" class="m-card" @click="handleEdit(row)">
        <div class="m-card-head">
          <span class="m-date">{{ row.created_at }}</span>
          <span class="m-mood">情绪: {{ row.moodScore }}</span>
        </div>
        <div class="m-indicators">
          <span>鼻塞: {{ row.bisaiDegree }}/10</span>
          <span>睡眠: {{ row.sleepQuality }}/10</span>
          <span>压力: {{ row.stressLevel }}/10</span>
        </div>
        <div class="m-content" v-if="row.content">{{ row.content }}</div>
        <div class="m-ai" v-if="row.aiContent">
          <el-icon :size="14"><ChatDotRound /></el-icon>
          <span>{{ row.aiContent }}</span>
        </div>
        <div class="m-card-actions" @click.stop>
          <el-button text type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </div>
      </div>
    </div>

    <div class="m-pagination" v-if="pagination.total > pagination.pageSize">
      <el-pagination layout="prev, next" :page-size="pagination.pageSize" :total="pagination.total" @current-change="handleChange" small />
    </div>

    <DiaryDialog v-model:modelValue="dialogVisible" :diaryRow="currentRow" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '@/api/admin.js'
import DiaryDialog from '@/components/diaryDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const tableData = ref([])
const dialogVisible = ref(false)
const currentRow = ref(null)

const handleSuccess = () => {
  dialogVisible.value = false
  currentRow.value = null
  getPageData()
}

const handleEdit = (row) => {
  if (!row.id) {
    currentRow.value = null
    dialogVisible.value = true
  } else {
    adminApi.getDiaryById(row.id).then(res => {
      currentRow.value = res.data
      dialogVisible.value = true
    })
  }
}

const handleDelete = async (id) => {
  ElMessageBox.confirm('确定删除吗?', '确认', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => {
    adminApi.deleteDiary(id).then(() => {
      ElMessage.success('删除成功')
      getPageData()
    })
  })
}

const pagination = ref({ total: 0, pageSize: 10, currentPage: 1 })

const getPageData = async () => {
  try {
    const res = await adminApi.getDiary({ params: { page: pagination.value.currentPage, pageSize: pagination.value.pageSize } })
    tableData.value = res.data
    pagination.value.total = res.total
  } catch (err) { console.error('获取数据失败：', err) }
}

const handleChange = (page) => { pagination.value.currentPage = page; getPageData() }

onMounted(() => getPageData())
</script>

<style scoped lang="scss">
.m-page { padding-bottom: 16px; background: transparent; }
.m-toolbar { display: flex; justify-content: flex-end; margin-bottom: 12px; }
.m-empty { text-align: center; color: #909399; padding: 40px 0; }
.m-list { display: flex; flex-direction: column; gap: 10px; }
.m-card { background: #fff; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.m-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.m-date { font-size: 14px; font-weight: 600; color: #303133; }
.m-mood { font-size: 13px; color: #e6a23c; font-weight: 500; }
.m-indicators { display: flex; gap: 12px; font-size: 12px; color: #606266; margin-bottom: 8px; }
.m-content { font-size: 13px; color: #303133; line-height: 1.5; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.m-ai { display: flex; align-items: flex-start; gap: 6px; font-size: 12px; color: #67c23a; background: #f0f9eb; padding: 8px; border-radius: 8px; margin-bottom: 6px; }
.m-card-actions { display: flex; justify-content: flex-end; border-top: 1px solid #f0f0f0; padding-top: 8px; }
.m-pagination { display: flex; justify-content: center; margin-top: 16px; }

/* 手机端覆盖 Dialog 宽度 */
:deep(.el-dialog) {
  width: 92% !important;
  max-width: 92vw !important;
}
:deep(.el-dialog__body) {
  padding: 16px 12px;
}
:deep(.el-form-item__label) {
  width: 70px !important;
}
</style>
