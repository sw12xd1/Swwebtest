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
    getTask(data) {
        return service.get('task/page', data)
    },
    getTaskById(id) {
        return service.get(`task/${id}`)
    },
    deleteTask(id) {
        return service.delete(`task/${id}`)
    },


}