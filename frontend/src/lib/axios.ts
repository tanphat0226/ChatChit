import { useAuthStore } from '@/stores/useAuthStore'
import axios from 'axios'

const MAX_RETRY_COUNT = 4

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
})

// Assign access token to headers request
api.interceptors.request.use((config) => {
	const { accessToken } = useAuthStore.getState()

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

// Auto refresh token when access token expires
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		// Ignore api don't need to check
		if (
			originalRequest.url?.includes('/auth/signin') ||
			originalRequest.url?.includes('/auth/signup') ||
			originalRequest.url?.includes('/auth/refresh')
		) {
			return Promise.reject(error)
		}

		originalRequest._retryCount = originalRequest._retryCount || 0

		if (
			error.response?.status === 403 &&
			originalRequest._retryCount < MAX_RETRY_COUNT
		) {
			originalRequest._retryCount += 1

			try {
				const res = await api.post('/auth/refresh', {
					withCredentials: true,
				})
				const { accessToken } = res.data

				useAuthStore.getState().setAccessToken(accessToken)

				originalRequest.headers.Authorization = `Bearer ${accessToken}`

				return api(originalRequest)
			} catch (error) {
				useAuthStore.getState().clearState()
				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	}
)

export default api
