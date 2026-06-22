<template>
    <div>
        <PageHead title="日记分析">
            <template #buttons>
                <el-button type="primary" @click="handleEdit({})">新增</el-button>
            </template>
        </PageHead>

        <el-table :data="tableData" style="width: 100%" :row-style="{ height: '72px' }">
            <el-table-column fixed="left" prop="created_at" label="记录日期" width="160" />

            <el-table-column prop="moodScore" label="情绪评分" min-width="90" />

            <el-table-column label="生活指标" min-width="120">
                <template #default="{ row }">
                    <div style="line-height: 1.8; font-size: 12px">
                        <div>鼻塞：{{ row.bisaiDegree }} / 10</div>
                        <div>睡眠：{{ row.sleepQuality }} / 10</div>
                        <div>压力：{{ row.stressLevel }} / 10</div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="content" label="日记内容" min-width="200" show-overflow-tooltip />

            <el-table-column prop="aiContent" label="AI 分析" min-width="200" show-overflow-tooltip />

            <el-table-column label="操作" width="150" fixed="right" align="center">
                <template #default="scope">
                    <el-button text @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
                    <el-button text @click="handleDelete(scope.row.id)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            style="margin-top: 25px;"
            @current-change="handleChange"
        />

        <DiaryDialog v-model:modelValue="dialogVisible" :diaryRow="currentRow" @success="handleSuccess" />
    </div>
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import { ref, onMounted } from 'vue'
import adminApi from '../api/admin.js'
import DiaryDialog from '../components/diaryDialog.vue'
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
    ElMessageBox.confirm('你确定要删除吗?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        adminApi.deleteDiary(id).then(() => {
            ElMessage.success('删除成功')
            getPageData()
        })
    })
}

const pagination = ref({
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

const getPageData = async () => {
    try {
        const res = await adminApi.getDiary({
            params: {
                page: pagination.value.currentPage,
                pageSize: pagination.value.pageSize,
            }
        })
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

onMounted(() => {
    getPageData()
})
</script>