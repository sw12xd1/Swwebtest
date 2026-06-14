<template>
    <div>
        <PageHead title="鼻塞分析">
            <template #buttons>
                <el-button type="primary" @click="handleEdit({})">新增</el-button>
            </template>
        </PageHead>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed="left" prop="created_at" label="创建日期" width="180">
                <template #default="{row}">
                    {{ row.created_at }}
                </template>
            </el-table-column>
            <el-table-column prop="isCold" label="是否着凉" min-width="100">
                <template #default="{ row }">
                    {{ row.isCold ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="isFan" label="是否吹风扇" min-width="100">
                <template #default="{ row }">
                    {{ row.isFan ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="isSelf" label="是否自卫" min-width="100">
                <template #default="{ row }">
                    {{ row.isSelf ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="isSpray" label="是否喷药" min-width="100">
                <template #default="{ row }">
                    {{ row.isSpray ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="moodDegree" label="心情愉悦程度" min-width="100"/>
            <el-table-column prop="bisaiDegree" label="鼻塞程度" min-width="100"/>

            <el-table-column label="操作" width="150" fixed="right">
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
        <BisaiDialog v-model:modelValue="dialogVisible" :bisaiRow="currentRow" @success="handleSuccess"/>
    </div> 
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import { ref, onMounted } from 'vue'
import adminApi from '../api/admin.js'
import BisaiDialog from '../components/BisaiDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const tableData = ref([])

// 弹窗
const dialogVisible = ref(false)

// 弹窗 成功回调
const handleSuccess = () => {
    dialogVisible.value = false
    currentRow.value = null
    getPageData()
}

// 编辑数据
const currentRow = ref(null)
const handleEdit = (row) => {
    if(!row.id){
        currentRow.value = null
        dialogVisible.value = true
    }else{
        // 编辑回显
        adminApi.getBisaiById(row.id).then(res => {
            console.log("scope.row/currentRow/formData 数据", row)
            console.log("当前行数据", res)
            currentRow.value = res.data
            dialogVisible.value = true
        })
    }
}

// 删除接口
const handleDelete = async (id) => {
    ElMessageBox.confirm(
        '你确定要删除吗?',
        '确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
    .then(() => {
        adminApi.deleteBisai(id).then(res => {
            console.log("删除数据", res)
            ElMessage.success('删除成功')
            getPageData()
        })
    })
}


// 分页数据
const pagination = ref({
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

// 分页接口
const getPageData = async () => {
    try{
        const res = await adminApi.getBisai({
            params:{
                page: pagination.value.currentPage,
                pageSize: pagination.value.pageSize,
            }
        })
        console.log("当前页数据", res)
        tableData.value = res.data
        pagination.value.total = res.total
    }catch(err){
        console.error('获取数据失败：', err)
    }
}

// 分页改变
const handleChange = (page) => {
    pagination.value.currentPage = page
    getPageData()
}


onMounted(() => {
    getPageData()
})

</script>

