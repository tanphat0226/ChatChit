import type { User } from './user'

export interface AuthState {
	accessToken: string | null
	user: User | null
	isLoading: boolean

	clearState: () => void

	signUp: ({
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
	}) => Promise<void>

	signIn: ({
		username,
		password,
	}: {
		username: string
		password: string
	}) => Promise<void>

	signOut: () => Promise<void>

	fetchMe: () => Promise<void>
}
