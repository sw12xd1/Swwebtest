<template>
    <el-dialog
        v-model="visible"
        :title="isEdit ? '编辑日记' : '新增日记'"
        width="50%"
        @close="handleClose"
    >
        <el-form :model="form" label-width="90px">

            <el-form-item label="记录日期">
                <el-date-picker
                    v-model="form.created_at"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    placeholder="选择日期"
                    style="width: 100%"
                />
            </el-form-item>

            <el-form-item label="情绪评分">
                <div style="width: 180.34px">
                    <el-slider v-model="form.moodScore" :max="10" :step="0.1" />
                </div>
                <span style="margin-left: 12px; color: #909399">{{ form.moodScore }}</span>
            </el-form-item>

            <el-form-item label="生活指标">
                <div style="width: 100%">
                    <div style="display: flex; align-items: center; margin-bottom: 12px">
                        <span style="width: 70px; font-size: 13px; color: #606266; flex-shrink: 0">鼻塞程度</span>
                        <div style="width: 260px">
                            <el-slider v-model="form.bisaiDegree" disabled :max="10" :step="0.1" />
                        </div>
                        <span style="margin-left: 12px; color: #909399; font-size: 13px">{{ form.bisaiDegree }}</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 12px">
                        <span style="width: 70px; font-size: 13px; color: #606266; flex-shrink: 0">睡眠质量</span>
                        <div style="width: 260px">
                            <el-slider v-model="form.sleepQuality"disabled :max="10" :step="0.1" />
                        </div>
                        <span style="margin-left: 12px; color: #909399; font-size: 13px">{{ form.sleepQuality }}</span>
                    </div>
                    <div style="display: flex; align-items: center">
                        <span style="width: 70px; font-size: 13px; color: #606266; flex-shrink: 0">压力程度</span>
                        <div style="width: 260px">
                            <el-slider v-model="form.stressLevel" :max="10" :step="0.1" />
                        </div>
                        <span style="margin-left: 12px; color: #909399; font-size: 13px">{{ form.stressLevel }}</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="日记内容">
                <el-input
                    v-model="form.content"
                    type="textarea"
                    :rows="6"
                    :autosize="{ minRows: 4, maxRows: 10 }"
                    placeholder="写下今天发生的事…"
                />
            </el-form-item>

            <!-- AI 分析区域 -->
            <el-form-item v-if="isEdit && form.aiContent" label="AI 分析">
                <div style="width: 100%; padding: 12px; background: #f5f7fa; border-radius: 6px; font-size: 13px; line-height: 1.8; color: #606266; white-space: pre-wrap">
                    {{ form.aiContent }}
                </div>
            </el-form-item>
            <el-form-item v-else-if="isEdit && !form.aiContent" label="AI 分析">
                <span style="font-size: 13px; color: #909399">后台生成中，稍后刷新查看…</span>
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
    diaryRow: Object,
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.diaryRow?.id)

const defaultForm = () => ({
    created_at: '',
    moodScore: 0,
    bisaiDegree: 0,
    sleepQuality: 0,
    stressLevel: 0,
    content: '',
})

const form = ref(defaultForm())

watch(() => props.diaryRow, (row) => {
    form.value = row ? { ...defaultForm(), ...row } : defaultForm()
}, { immediate: true })

const handleClose = () => {
    visible.value = false
    form.value = defaultForm()
}

const handleSubmit = async () => {
    try {
        if (isEdit.value) {
            await adminApi.updateDiary(props.diaryRow.id, form.value)
            ElMessage.success('编辑成功，AI 分析后台更新中…')
        } else {
            await adminApi.createDiary(form.value)
            ElMessage.success('新增成功，AI 分析生成中…')
        }
        emit('success')
    } catch (err) {
        console.error(err)
        ElMessage.error('操作失败')
    }
}

watch(() => form.value.created_at, async (date) => {
    if (!date || isEdit.value) return
    try {
        const [bisaiRes, sleepRes] = await Promise.all([
            adminApi.getBisaiByDate(date),
            adminApi.getSleepByDate(date),
        ])
        form.value.bisaiDegree = bisaiRes.data?.bisaiDegree ?? 0
        form.value.sleepQuality = sleepRes.data?.sleepQuality ?? 0
    } catch (err) {
        console.error(err)
        form.value.bisaiDegree = 0
        form.value.sleepQuality = 0
    }
})
</script>

<style lang="scss" scoped>
/* textarea 美化 */
:deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  background: #fafbfc;
  font-size: 14px;
  line-height: 1.7;
  padding: 14px 16px;
  transition: border-color 0.25s, box-shadow 0.25s;
  resize: vertical;
  max-height: 35vh;
  min-height: 12vh;

  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
    background: #fff;
  }

  &::placeholder {
    color: #c0c4cc;
  }
}
</style>