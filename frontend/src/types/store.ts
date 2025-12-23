import type { Conversation, Message } from './chat'
import type { User } from './user'

export interface AuthState {
	accessToken: string | null
	user: User | null
	isLoading: boolean

	setAccessToken: (accessToken: string | null) => void

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

	refreshToken: () => Promise<void>
}

export interface ThemeState {
	isDarkMode: boolean
	toggleTheme: () => void
	setTheme: (dark: boolean) => void
}

export interface ChatState {
	conversations: Conversation[]
	messages: Record<
		string,
		{
			items: Message[]
			hasMore: boolean // infinite scroll
			nextCursor?: string | null
		}
	>

	activeConversationId: string | null
	isConvoLoading: boolean
	isMessageLoading: boolean

	reset: () => void
	setActiveConversation: (conversationId: string | null) => void
	fetchConversations: () => Promise<void>
	fetchMessages: (conversationId?: string) => Promise<void>
	sendDirectMessage: (
		recipientId: string,
		content?: string,
		imgUrl?: string
	) => Promise<void>
	sendGroupMessage: (
		conversationId: string,
		content?: string,
		imgUrl?: string
	) => Promise<void>
}
