import { useAuthStore } from '@/stores/useAuthStore'
import axios from 'axios'

const api = axios.create({
	baseURL:
		import.meta.env.MODE === 'development'
			? 'http://localhost:5001/api'
			: '/api',
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

export default api
