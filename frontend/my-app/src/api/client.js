import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})

// ✅ Добавляем access token в каждый запрос
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ✅ Обработка 401 (токен истёк) - пытаемся обновить
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        // Если ошибка 401 и это не повторная попытка
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh')

                if (!refreshToken) {
                    // Нет refresh токена - нужно логиниться заново
                    localStorage.removeItem('access')
                    localStorage.removeItem('refresh')
                    window.location.href = '/login'
                    return Promise.reject(error)
                }

                // ✅ Пытаемся обновить access токен
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/token/refresh/',
                    { refresh: refreshToken }
                )

                const newAccessToken = response.data.access
                localStorage.setItem('access', newAccessToken)

                // ✅ Повторяем исходный запрос с новым токеном
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                // Refresh не сработал - логинимся заново
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api  // ← this line must exist