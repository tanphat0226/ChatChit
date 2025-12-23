import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ChatAppPage from './pages/ChatAppPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './stores/useAuthStore'
import { useSocketStore } from './stores/useSocketStore'
import { useThemeStore } from './stores/useThemeStore'

function App() {
	const { isDarkMode, setTheme } = useThemeStore()
	const { accessToken } = useAuthStore()
	const { connectSocket, disconnectSocket } = useSocketStore()

	// Ensure the theme is applied on initial load
	useEffect(() => {
		setTheme(isDarkMode)
	}, [setTheme, isDarkMode])

	// Manage socket connection based on authentication state
	useEffect(() => {
		// Connect socket if accessToken is available
		if (accessToken) {
			connectSocket()
		}

		// Disconnect socket on cleanup
		return () => {
			disconnectSocket()
		}
	}, [accessToken, connectSocket, disconnectSocket])

	return (
		<>
			<Toaster richColors />
			<BrowserRouter>
				<Routes>
					{/* Public Routes */}
					<Route path='/signin' element={<SignInPage />} />
					<Route path='/signup' element={<SignUpPage />} />

					{/* Private Routes */}
					<Route element={<ProtectedRoute />}>
						<Route path='/' element={<ChatAppPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
