<template>
    <div class="Navbar">
        <div class="flex-box">
            <el-button @click="handleCollapse">
                <el-icon><Expand /></el-icon>
            </el-button>
            <p class="page-title">导航栏</p>
        </div>

        <div class="flex-box">
            <el-dropdown @command="handleCommand">
                <div class="flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
                    <p class="user-name">admin</p>
                    <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>            
        </div>
    </div>
</template>
<script setup>
import {useAdminStore} from '@/stores/admin'
const handleCommand = (command) => {
    if(command === 'logout'){
        // logout
    }
}

const handleCollapse = () => {
    useAdminStore().toggleCollapsed()
    // console.log(useAdminStore().isCollapsed)
}



</script>
<style lang="scss" scoped>
.Navbar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    .flex-box{
        display: flex;
        justify-content: center;
        align-items: center;
        .user-name{
            margin-left: 10px;
        }
    }
    .page-title{
        font-size: 26px;
        margin-left: 20px;
        font-weight: 500;
        color: #1f2937;
    }
}
</style>