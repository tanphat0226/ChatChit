import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import ChatAppPage from './pages/ChatAppPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
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
