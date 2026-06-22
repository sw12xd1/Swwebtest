<template>
    <div>
        <PageHead title="睡眠分析">
            <template #buttons>
                <el-button type="primary" @click="handleEdit({})">新增</el-button>
            </template>
        </PageHead>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="睡觉时间" min-width="120">
                <template #default="{ row }">
                    <div style="display: flex; gap: 6px; align-items: center">
                        <span>{{ row.created_at }}</span>
                        <span>{{ row.sleepTime }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="heartRate" label="心率" min-width="100" />

            <el-table-column prop="isNoise" label="噪音干扰" min-width="100">
                <template #default="{ row }">
                    {{ row.isNoise ? '有' : '无' }}
                </template>
            </el-table-column>

            <el-table-column prop="isBisai" label="鼻塞" min-width="100">
                <template #default="{ row }">
                    {{ row.isBisai ? '是' : '否' }}
                </template>
            </el-table-column>

            <el-table-column prop="isSugar" label="奶茶/巧克力" min-width="120">
                <template #default="{ row }">
                    {{ row.isSugar ? '是' : '否' }}
                </template>
            </el-table-column>

            <el-table-column prop="isTooLate" label="过晚上床" min-width="100">
                <template #default="{ row }">
                    {{ row.isTooLate ? '是' : '否' }}
                </template>
            </el-table-column>

            <el-table-column prop="sleepQuality" label="睡眠质量" min-width="100" />

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

        <SleepDialog v-model:modelValue="dialogVisible" :sleepRow="currentRow" @success="handleSuccess" />
    </div>
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import { ref, onMounted } from 'vue'
import adminApi from '../api/admin.js'
import SleepDialog from '../components/SleepDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const tableData = ref([])

// 弹窗
const dialogVisible = ref(false)

// 弹窗成功回调
const handleSuccess = () => {
    dialogVisible.value = false
    currentRow.value = null
    getPageData()
}

// 编辑
const currentRow = ref(null)
const handleEdit = (row) => {
    if (!row.id) {
        currentRow.value = null
        dialogVisible.value = true
    } else {
        adminApi.getSleepById(row.id).then(res => {
            currentRow.value = res.data
            dialogVisible.value = true
        })
    }
}

// 删除
const handleDelete = async (id) => {
    ElMessageBox.confirm('你确定要删除吗?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        adminApi.deleteSleep(id).then(() => {
            ElMessage.success('删除成功')
            getPageData()
        })
    })
}

// 分页
const pagination = ref({
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

const getPageData = async () => {
    try {
        const res = await adminApi.getSleep({
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