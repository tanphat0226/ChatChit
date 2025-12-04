import api from '@/lib/axios'

export const authService = {
	signUp: async ({
		firstName,
		lastName,
		username,
		email,
		password,
	}: {
		firstName: string
		lastName: string
		username: string
		email: string
		password: string
	}) => {
		const res = await api.post(
			'/auth/signup',
			{
				firstName,
				lastName,
				username,
				email,
				password,
			},
			{ withCredentials: true }
		)

		return res.data
	},

	signIn: async ({
		username,
		password,
	}: {
		username: string
		password: string
	}) => {
		const res = await api.post(
			'/auth/signin',
			{
				username,
				password,
			},
			{ withCredentials: true }
		)

		return res.data
	},

	signOut: async () => {
		return api.post('/auth/signout', { withCredentials: true })
	},

	fetchMe: async () => {
		const res = await api.get('/users/me', { withCredentials: true })

		return res.data.user
	},
}
