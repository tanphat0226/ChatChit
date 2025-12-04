import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
	const { accessToken, user, isLoading } = useAuthStore()

	if (!accessToken) {
		return <Navigate to='/signin' replace />
	}

	return <Outlet />
}

export default ProtectedRoute
