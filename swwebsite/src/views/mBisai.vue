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
          <span class="m-degree">鼻塞程度: {{ row.bisaiDegree }}</span>
        </div>
        <div class="m-card-tags">
          <el-tag :type="row.isCold ? 'danger' : 'info'" size="small">着凉: {{ row.isCold ? '是' : '否' }}</el-tag>
          <el-tag :type="row.isFan ? 'warning' : 'info'" size="small">风扇: {{ row.isFan ? '是' : '否' }}</el-tag>
          <el-tag :type="row.isSelf ? 'warning' : 'info'" size="small">自卫: {{ row.isSelf ? '是' : '否' }}</el-tag>
          <el-tag :type="row.isSpray ? 'success' : 'info'" size="small">喷药: {{ row.isSpray ? '是' : '否' }}</el-tag>
        </div>
        <div class="m-card-actions" @click.stop>
          <el-button text type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </div>
      </div>
    </div>

    <div class="m-pagination" v-if="pagination.total > pagination.pageSize">
      <el-pagination
        layout="prev, next"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handleChange"
        small
      />
    </div>

    <BisaiDialog v-model:modelValue="dialogVisible" :bisaiRow="currentRow" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '@/api/admin.js'
import BisaiDialog from '@/components/BisaiDialog.vue'
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
    adminApi.getBisaiById(row.id).then(res => {
      currentRow.value = res.data
      dialogVisible.value = true
    })
  }
}

const handleDelete = async (id) => {
  ElMessageBox.confirm('确定删除吗?', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    adminApi.deleteBisai(id).then(() => {
      ElMessage.success('删除成功')
      getPageData()
    })
  })
}

const pagination = ref({ total: 0, pageSize: 10, currentPage: 1 })

const getPageData = async () => {
  try {
    const res = await adminApi.getBisai({ params: { page: pagination.value.currentPage, pageSize: pagination.value.pageSize } })
    tableData.value = res.data
    pagination.value.total = res.total
  } catch (err) {
    console.error('获取数据失败：', err)
  }
}

const handleChange = (page) => {
  pagination.value.currentPage = page
  getPageData()
}

onMounted(() => getPageData())
</script>

<style scoped lang="scss">
.m-page {
  padding-bottom: 16px;
  background: transparent;
}

.m-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.m-empty {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}

.m-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.m-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.m-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.m-date {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.m-degree {
  font-size: 13px;
  color: #409eff;
  font-weight: 500;
}

.m-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.m-card-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.m-pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* 手机端覆盖 Dialog 宽度 */
:deep(.el-dialog) {
  width: 92% !important;
  max-width: 92vw !important;
}
:deep(.el-dialog__body) {
  padding: 16px 12px;
}
</style>
