<template>
    <el-dialog 
        v-model="dialogVisible" 
        :title="isEdit?'编辑':'新增'" 
        width="50%"
        @close="handleClose">

        <el-form :model="formData" :rules="rules">
            <el-form-item label="Promotion name" :label-width="formLabelWidth">
                <el-input v-model="formData.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Zones" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai" />
                <el-option label="Zone No.2" value="beijing" />
            </el-select>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
const dialogVisible = ref(false)
</script>
