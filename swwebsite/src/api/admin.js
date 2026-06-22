import service from '@/utils/request'
import { get } from '@vueuse/core'

export default{

    // 鼻塞view
    createBisai(data) {
        return service.post('/bisai/add', data)
    },
    updateBisai(id, data) {
        return service.put(`/bisai/${id}`, data)
    },
    getBisai(data) {
        return service.get('/bisai/page', data)
    },
    getBisaiById(id) {
        return service.get(`bisai/${id}`)
    },
    deleteBisai(id) {
        return service.delete(`/bisai/${id}`)
    },

    // task view
    createTask(data) {
        return service.post('task/add', data)
    },
    getTasks(data) {
        return service.get('task/page', data)
    },
    updateTaskStatus(id, data) {
        return service.put(`task/update/status/${id}`, data)
    },
    deleteTask(id) {
        return service.delete(`task/${id}`)
    },
    updateTask(id, data) {
        return service.put(`/task/update/task/${id}`, data)
    },

    // sleep view
    createSleep(data) {
        return service.post('sleep/add', data)
    },
    getSleep(data) {
        return service.get('sleep/page', data)
    },
    getSleepById(id) {
        return service.get(`sleep/${id}`)
    },
    updateSleep(id, data) {
        return service.put(`sleep/${id}`, data)
    },
    deleteSleep(id) {
        return service.delete(`sleep/${id}`)
    },

    // diary view
    getDiary: (config) => service.get('/diary/page', config),
    getDiaryById: (id) => service.get(`/diary/${id}`),
    createDiary: (data) => service.post('/diary/add', data),
    updateDiary: (id, data) => service.put(`/diary/${id}`, data),
    deleteDiary: (id) => service.delete(`/diary/${id}`),

    getBisaiByDate: (date) => service.get(`/bisai/date/${date}`),
    getSleepByDate: (date) => service.get(`/sleep/date/${date}`),
}