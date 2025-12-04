import { authService } from '@/services/authServices'
import type { AuthState } from '@/types/store'
import { toast } from 'sonner'
import { create } from 'zustand'

export const useAuthStore = create<AuthState>((set, get) => ({
	accessToken: null,
	user: null,
	isLoading: false,

	setAccessToken: (accessToken) => set({ accessToken }),

	clearState: () => set({ accessToken: null, user: null, isLoading: false }),

	signUp: async ({ firstName, lastName, username, email, password }) => {
		try {
			set({ isLoading: true })

			// Call API to sign up the user
			await authService.signUp({
				firstName,
				lastName,
				username,
				email,
				password,
			})

			toast.success('Sign up successful! You can now sign in.')
		} catch (error) {
			console.error(error)
			toast.error('Failed to sign up. Please try again.')
		} finally {
			set({ isLoading: false })
		}
	},

	signIn: async ({ username, password }) => {
		try {
			set({ isLoading: true })

			// Call API to sign in the user
			const { accessToken } = await authService.signIn({
				username,
				password,
			})

			get().setAccessToken(accessToken)
			// Fetch the authenticated user's details
			await get().fetchMe()
			toast.success('Sign in successful! Welcome back. 🎆')
		} catch (error) {
			console.error(error)
			toast.error('Failed to sign in. Please try again.')
		} finally {
			set({ isLoading: false })
		}
	},

	signOut: async () => {
		try {
			await authService.signOut()
			get().clearState()

			toast.success('Sign out successful! 👋')
		} catch (error) {
			console.error(error)
			toast.error('Failed to sign out. Please try again.')
		}
	},

	fetchMe: async () => {
		try {
			set({ isLoading: true })

			const user = await authService.fetchMe()

			set({ user })
		} catch (error) {
			console.error(error)

			set({ accessToken: null, user: null })

			toast.error('Failed to fetch user. Please try again.')
		} finally {
			set({ isLoading: false })
		}
	},

	refreshToken: async () => {
		try {
			set({ isLoading: true })
			const { user, fetchMe, setAccessToken } = get()
			const accessToken = await authService.refreshToken()

			setAccessToken(accessToken)

			if (!user) {
				await fetchMe()
			}
		} catch (error) {
			console.error(error)
			toast.error('Session expired. Please sign in again.')
			get().clearState()
		} finally {
			set({ isLoading: false })
		}
	},
}))
