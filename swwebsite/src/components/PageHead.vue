<template>
    <div class="page-head">
        <p class="page-title">{{props.title}}</p>
        <div class="action-btn">
            <slot name="buttons"></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: '页面标题'
    }
})
</script>

<style lang="scss" scoped>
.page-head{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .page-title {
        font-size: 24px;
        color: #1e3a5f;
        font-weight: 600;
        animation: titleIn 0.5s ease both;
    }
}

@keyframes titleIn {
  from { opacity: 0; transform: translateY(-8px); letter-spacing: 4px; }
  to   { opacity: 1; transform: translateY(0);   letter-spacing: 0; }
}
</style>