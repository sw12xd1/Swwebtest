<template>
    <el-dialog 
        v-model="dialogVisible" 
        :title="isEdit ? '编辑' : '新增鼻塞日志' " 
        width="50%"
        @close="handleClose">

        <el-form :model="formData" ref="formRef" :rules="rules">
            <el-form-item label="日期" prop="created_at" inline-message>
                <el-date-picker 
                    v-model="formData.created_at" 
                    type="date" 
                    placeholder="选择日期" 
                    style="width: 150px"
                    :clearable="false"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"       
                />
            </el-form-item>
            <el-form-item prop="isCold" label="是否着凉">
                <el-switch prop="isCold" v-model="formData.isCold"  
                inline-prompt 
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" 
                active-text="Y" 
                inactive-text="N"
                :active-value="1" 
                :inactive-value="0" 
                />
            </el-form-item>            
                  <el-form-item label="是否吹风扇" prop="isFan">
                <el-switch 
                    v-model="formData.isFan" 
                    inline-prompt 
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="Y" 
                    inactive-text="N"
                    :active-value="1" 
                    :inactive-value="0"
                />
            </el-form-item>

            <el-form-item label="是否自慰" prop="isSelf">
                <el-switch 
                    v-model="formData.isSelf" 
                    inline-prompt 
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="Y" 
                    inactive-text="N" 
                    :active-value="1" 
                    :inactive-value="0"
                />
            </el-form-item>

            <el-form-item label="是否喷药" prop="isSpray">
                <el-switch 
                    v-model="formData.isSpray" 
                    inline-prompt 
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="Y" 
                    inactive-text="N" 
                    :active-value="1" 
                    :inactive-value="0"
                />
            </el-form-item>

            <el-form-item label="心情愉悦程度" prop="moodDegree">
                <el-slider 
                    v-model="formData.moodDegree" 
                    :max="10" 
                    style="width: 350px"
                    :step="0.1"
                />
            </el-form-item>

            <el-form-item label="鼻塞程度" prop="bisaiDegree">
                <el-slider 
                    v-model="formData.bisaiDegree" 
                    :max="10" 
                    style="width: 350px"
                    :step="0.1"
                />
            </el-form-item>

        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="handleSubmit()">{{ isEdit ? '更 新' : '创 建' }}</el-button>
            </span>
        </template>        
    </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import adminApi from '@/api/admin'
import { ElMessage } from 'element-plus'
import { tryOnUnmounted } from '@vueuse/core';
// form数据
const formRef = ref()
const rules = reactive({})
const formData = reactive({
  created_at: '',
  isCold: 0,
  isFan: 0,
  isSelf: 0,
  isSpray: 0,
  moodDegree: 0,
  bisaiDegree: 0,
})

// rules
rules.created_at = [
    { required: true, message: '请选择日期', trigger: 'blur' }
]



// props和emit
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    bisaiRow:{
        type: Object,
        default: null
    }
})

// 监听回显
watch( () => props.bisaiRow, (newVal) => {
    if(newVal){
        nextTick(() => {
            Object.assign(formData, newVal)
        })
    }
})
const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
    get(){
        return props.modelValue
    },
    set(val){
        emit('update:modelValue', val)
    }
})

const isEdit = computed(() => !!props.bisaiRow?.id)

const handleClose = (() => {
    emit('update:modelValue', false)
    formRef.value.resetFields()
})

// 提交数据
const loading = ref(false)
const handleSubmit = async () => {

    await formRef.value.validate((valid, fields) => {
        if(valid){
            loading.value = true
        }
        
        formData.created_at = formData.created_at?.split('T')[0]

        if(isEdit.value){
            adminApi.updateBisai(formData.id, formData).then(res => {
                loading.value = false
                emit('success')
                console.log(res)
                ElMessage({
                    message: '编辑成功',
                    type: 'success',
                })
            })
        }
        else{
            adminApi.createBisai(formData).then(res => {
                loading.value = false
                emit('success')
                console.log(res)
                ElMessage({
                    message: '创建成功',
                    type: 'success',
                })
            })

        }

    })
}

</script>


<style lang="scss" scoped>
.el-form{
    .el-form-item{
        margin-bottom: 2px;
    }
    .el-switch{
        margin-left: 6px;
    }
    .el-slider{
        margin-left: 16px;
    }
    .slider-demo-block {
        max-width: 600px;
        display: flex;
        align-items: center;
    }
    .slider-demo-block .el-slider {
        margin-top: 0;
        margin-left: 12px;
    }
    .slider-demo-block .demonstration {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        line-height: 44px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0;
    }
    .slider-demo-block .demonstration + .el-slider {
        flex: 0 0 70%;
    }
}


</style>