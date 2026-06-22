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
                path: 'sleep',
                component: () => import('@/views/sleep.vue'),
                meta: {
                    title: '睡眠分析',
                    icon: 'Avatar'
                }
            },
            {
                path: 'diary',
                component: () => import('@/views/diary.vue'),
                meta: {
                    title: '日志记录',
                    icon: 'Notebook'
                }
            },            
            {
                path: 'tasklist',
                component: () => import('@/views/TaskList.vue'),
                meta: {
                    title: '任务清单',
                    icon: 'List'
                }
            },

            
        ]
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes: BackEndRouter
})

export default router
