import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const BackEndRouter = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard.vue'),
                meta: {
                    title: '鼻塞分析',
                    icon: 'PieChart'
                }
            },
            {
                path: 'tasklist',
                component: () => import('@/views/tasklist.vue'),
                meta: {
                    title: '任务列表',
                    icon: 'List'
                }
            },
            {
                path: 'diary',
                component: () => import('@/views/diary.vue'),
                meta: {
                    title: '日记',
                    icon: 'Notebook'
                }
            },
            {
                path: 'sleep',
                component: () => import('@/views/sleep.vue'),
                meta: {
                    title: '睡眠',
                    icon: 'Avatar'
                }
            }
        ]
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes: BackEndRouter
})

export default router
