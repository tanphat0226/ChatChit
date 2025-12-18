import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ChatAppPage from './pages/ChatAppPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import { useThemeStore } from './stores/useThemeStore'
import { useEffect } from 'react'

function App() {
	const { isDarkMode, setTheme } = useThemeStore()

	// Ensure the theme is applied on initial load
	useEffect(() => {
		setTheme(isDarkMode)
	}, [setTheme, isDarkMode])

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
