import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('access')
    const isAuthEndpoint = config.url?.includes('/api/token')
    if (token && isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
localStorage.removeItem('access')
localStorage.removeItem('refresh')

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh')

                if (!refreshToken) {

                    localStorage.removeItem('access')
                    localStorage.removeItem('refresh')
                    window.location.href = '/login'
                    return Promise.reject(error)
                }


                const response = await axios.post(
                    'http://127.0.0.1:8000/api/token/refresh/',
                    { refresh: refreshToken }
                )

                const newAccessToken = response.data.access
                localStorage.setItem('access', newAccessToken)


                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)
            } catch (refreshError) {

                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api 