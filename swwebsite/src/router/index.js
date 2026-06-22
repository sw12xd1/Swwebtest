import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import MobileLayout from '@/components/MobileLayout.vue'

// 电脑版路由（不变）
const desktopRoutes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard.vue'),
                meta: { title: '鼻塞分析', icon: 'PieChart' }
            },
            {
                path: 'sleep',
                component: () => import('@/views/sleep.vue'),
                meta: { title: '睡眠分析', icon: 'Avatar' }
            },
            {
                path: 'diary',
                component: () => import('@/views/diary.vue'),
                meta: { title: '日志记录', icon: 'Notebook' }
            },
            {
                path: 'tasklist',
                component: () => import('@/views/TaskList.vue'),
                meta: { title: '任务清单', icon: 'List' }
            },
        ]
    }
]

// 手机版路由
const mobileRoutes = [
    {
        path: '/m',
        component: MobileLayout,
        children: [
            { path: 'bisai', component: () => import('@/views/mBisai.vue') },
            { path: 'sleep', component: () => import('@/views/mSleep.vue') },
            { path: 'diary', component: () => import('@/views/mDiary.vue') },
            { path: 'task',  component: () => import('@/views/mTask.vue') },
            { path: '', redirect: '/m/bisai' },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...desktopRoutes,
        ...mobileRoutes,
    ]
})

export default router
