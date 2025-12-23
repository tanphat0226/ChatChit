import { chatService } from '@/services/chatServices'
import type { ChatState } from '@/types/store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create<ChatState>()(
	persist(
		(set, get) => ({
			conversations: [],
			messages: {},
			activeConversationId: null,
			isConvoLoading: false, // for conversations
			isMessageLoading: false, // for messages

			setActiveConversation: (conversationId: string | null) => {
				set({ activeConversationId: conversationId })
			},

			reset: () => {
				set({
					conversations: [],
					messages: {},
					activeConversationId: null,
					isConvoLoading: false,
					isMessageLoading: false,
				})
			},

			fetchConversations: async () => {
				try {
					set({ isConvoLoading: true })
					const { conversations } =
						await chatService.fetchConversations()
					set({ conversations: conversations })
				} catch (error) {
					console.error('Failed to fetch conversations:', error)
				} finally {
					set({ isConvoLoading: false })
				}
			},
			fetchMessages: async (conversationId?: string) => {
				const { activeConversationId, messages } = get()
				const { user } = useAuthStore.getState()

				const convoId = conversationId ?? activeConversationId

				if (!convoId || !user) return

				const current = messages?.[convoId]
				const nextCursor =
					current?.nextCursor === undefined ? '' : current?.nextCursor

				if (nextCursor === null) return // no more messages to fetch

				set({ isMessageLoading: true })

				try {
					const { messages: fetched, cursor } =
						await chatService.fetchMessages(convoId, nextCursor)

					const processedMessages = fetched.map((msg) => {
						return {
							...msg,
							isOwn: msg.senderId === user._id,
						}
					})

					set((state) => {
						const prev = state.messages[convoId]?.items || []
						const merged =
							prev.length > 0
								? [...processedMessages, ...prev]
								: processedMessages

						return {
							messages: {
								...state.messages,
								[convoId]: {
									items: merged,
									hasMore: !!cursor,
									nextCursor: cursor ?? null,
								},
							},
						}
					})
				} catch (error) {
					console.error('Failed to fetch messages:', error)
				} finally {
					set({ isMessageLoading: false })
				}
			},
			sendDirectMessage: async (recipientId, content, imgUrl) => {
				try {
					const { activeConversationId } = get()

					await chatService.sendDirectMessage(
						recipientId,
						content,
						imgUrl,
						activeConversationId || undefined
					)

					set((state) => ({
						conversations: state.conversations.map((convo) =>
							convo._id === activeConversationId
								? { ...convo, seenBy: [] }
								: convo
						),
					}))
				} catch (error) {
					console.error('Failed to send direct message:', error)
				}
			},
			sendGroupMessage: async (conversationId, content, imgUrl) => {
				try {
					await chatService.sendGroupMessage(
						conversationId,
						content,
						imgUrl
					)

					set((state) => ({
						conversations: state.conversations.map((convo) =>
							convo._id === get().activeConversationId
								? { ...convo, seenBy: [] }
								: convo
						),
					}))
				} catch (error) {
					console.error('Failed to send group message:', error)
				}
			},
			addMessage: async (message) => {
				try {
					const { user } = useAuthStore.getState()
					const { fetchMessages } = get()

					message.isOwn = message.senderId === user?._id

					const convoId = message.conversationId

					let prevItems = get().messages[convoId]?.items ?? []

					if (prevItems.length === 0) {
						await fetchMessages(convoId)
						prevItems = get().messages[convoId]?.items ?? []
					}

					set((state) => {
						if (prevItems.some((msg) => msg._id === message._id)) {
							return state
						}

						return {
							messages: {
								...state.messages,
								[convoId]: {
									items: [...prevItems, message],
									hasMore: state.messages[convoId]?.hasMore,
									nextCursor:
										state.messages[convoId]?.nextCursor ??
										undefined,
								},
							},
						}
					})
				} catch (error) {
					console.error('Failed to add message:', error)
				}
			},
			updateConversation: (conversation) => {
				set((state) => ({
					conversations: state.conversations.map((convo) =>
						convo._id === conversation._id
							? { ...convo, ...conversation }
							: convo
					),
				}))
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
