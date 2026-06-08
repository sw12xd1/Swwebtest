<template>
    <div>
        <PageHead title="鼻塞分析">
            <template #buttons>
                <el-button type="primary" size="normal" @click="handleAdd({})">新增</el-button>
            </template>
        </PageHead>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="created_at" label="创建日期" mini-width="16.67%">
                <template #default="{row}">
                    {{ row.created_at?.slice(0, 10) }}
                </template>
            </el-table-column>
            <el-table-column prop="isCold" label="是否着凉" mini-width="16.67%">
                <template #default="{ row }">
                    {{ row.isCold ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="isFan" label="是否吹风扇" mini-width="16.67%">
                <template #default="{ row }">
                    {{ row.isFan ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="isSelf" label="是否自慰" mini-width="16.67%">
                <template #default="{ row }">
                    {{ row.isSelf ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="isSpray" label="是否喷药" mini-width="16.67%">
                <template #default="{ row }">
                    {{ row.isSpray ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="moodDegree" label="心情愉悦程度" mini-width="16.67%"/>
            <el-table-column prop="bisaiDegree" label="鼻塞程度" mini-width="16.67%"/>

            <el-table-column label="操作" mini-width="20%" fixed="right">
                <template #default="scope">
                    <el-button @click="editRow(scope)" type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            style="margin-top: 25px;"
            @Change="handleChange"
        />
<!-- <BisaiPopout v-model="dialogVisible" /> -->
    </div> 
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import BisaiPopout from '../components/bisaiPopout.vue'

// 弹窗
// const currentData = ref({})
// const dialogVisible = ref(false)

// const handleAdd = (row) => {
//     if(!row.id){
//         currentData.value = {}
//         dialogVisible.value = true
//     }
// }

// 表格数据
const tableData = ref([])

// 分页数据
const pagination = ref({
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

// 获取数据
const fetchData = async () => {
    try{
        const res = await request.get('/bisai')
        tableData.value = res
    }catch(err){
        console.error('获取数据失败：', err)
    }
}

// 编辑数据
const editRow = (scope) => {
    try{
        console.log(scope)
    }
    catch(err){
        console.error('编辑数据失败：', err)
    }
}

// 分页接口
const getPageData = async () => {
    try{
        const res = await request.get('/bisai/page', {
            params: {
                page: pagination.value.currentPage,
                pageSize: pagination.value.pageSize,
            }
        })
        tableData.value = res.data
        pagination.value.total = res.total
    }catch(err){
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
