import { chatService } from '@/services/chatServices'
import type { ChatStore } from '@/types/store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useChatStore = create<ChatStore>()(
	persist(
		(set, get) => ({
			conversations: [],
			message: {},
			activeConversationId: null,
			isLoading: false,

			setActiveConversation: (conversationId: string | null) => {
				set({ activeConversationId: conversationId })
			},

			reset: () => {
				set({
					conversations: [],
					message: {},
					activeConversationId: null,
					isLoading: false,
				})
			},

			fetchConversations: async () => {
				try {
					set({ isLoading: true })
					const { conversations } =
						await chatService.fetchConversations()
					set({ conversations: conversations })
				} catch (error) {
					console.error('Failed to fetch conversations:', error)
				} finally {
					set({ isLoading: false })
				}
			},
		}),
		{
			name: 'chat-storage',
			partialize: (state) => ({
				conversations: state.conversations,
			}),
		}
	)
)
