import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 5000
})

// Interceptors
request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器（统一处理错误）
request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('请求出错：', error)
    return Promise.reject(error)
  }
)

export default request