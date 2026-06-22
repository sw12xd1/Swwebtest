<template>
    <el-dialog
        v-model="visible"
        :title="isEdit ? '编辑睡眠记录' : '新增睡眠记录'"
        width="480px"
        @close="handleClose"
    >
        <el-form :model="form" label-width="110px">
            <el-form-item label="记录日期">
                <el-date-picker
                    v-model="form.created_at"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    placeholder="选择日期"
                />
            </el-form-item>

            <!-- 睡觉时间单独选，存 HH:mm -->
            <el-form-item label="睡觉时间">
                <el-time-picker
                    v-model="form.sleepTime"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                />
            </el-form-item>

            <el-form-item label="心率">
                <el-input-number v-model="form.heartRate" :min="30" :max="200" style="width: 100%" />
            </el-form-item>

            <el-form-item label="噪音干扰">
                <el-switch v-model="form.isNoise" :active-value="1":inactive-value="0" />
            </el-form-item>

            <el-form-item label="鼻塞">
                <el-switch v-model="form.isBisai" :active-value="1":inactive-value="0" />
            </el-form-item>

            <el-form-item label="奶茶/巧克力">
                <el-switch v-model="form.isSugar" :active-value="1":inactive-value="0" />
            </el-form-item>

            <el-form-item label="过晚上床">
                <el-switch v-model="form.isTooLate" :active-value="1":inactive-value="0" />
            </el-form-item>

            <el-form-item label="睡眠质量">
                 <el-slider
                    v-model="form.sleepQuality"
                    :max="10"
                    :step="0.1"
                    style="width: 250px;"
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import adminApi from '../api/admin.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
    modelValue: Boolean,
    sleepRow: Object,
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.sleepRow?.id)

const defaultForm = () => ({
    created_at: '', 
    sleepTime: '',
    heartRate: 60,
    isNoise: 0,
    isBisai: 0,
    isSugar: 0,
    isTooLate: 0,
    sleepQuality: 5,
})

const form = ref(defaultForm())

watch(() => props.sleepRow, (row) => {
    form.value = row ? { ...defaultForm(), ...row } : defaultForm()
}, { immediate: true })

const handleClose = () => {
    visible.value = false
    form.value = defaultForm()
}

const handleSubmit = async () => {
    try {
        if (isEdit.value) {
            await adminApi.updateSleep(props.sleepRow.id, form.value)
        } else {
            await adminApi.createSleep(form.value)
        }
        ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
        emit('success')
    } catch (err) {
        console.error(err)
        ElMessage.error('操作失败')
    }
}
</script>

<style scoped>
:deep(.el-slider) {
    margin-left: 8px;  /* slider 左边距 */
}
</style>