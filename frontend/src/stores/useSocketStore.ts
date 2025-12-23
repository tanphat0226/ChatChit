import { io, type Socket } from 'socket.io-client'
import { create } from 'zustand'

import type { SocketState } from '@/types/store'
import { useAuthStore } from './useAuthStore'
import { useChatStore } from './useChatStore'

const baseURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,
	onlineUsers: [],
	connectSocket: () => {
		const accessToken = useAuthStore.getState().accessToken
		const existingSocket = get().socket

		// Prevent multiple connections
		if (existingSocket) return

		const socket: Socket = io(baseURL, {
			auth: {
				token: accessToken,
			},
			transports: ['websocket'],
		})

		set({ socket })

		// Connect event listener
		socket.on('connect', () => {
			console.log('Socket connected:', socket.id)
		})

		// Online users event listener
		socket.on('onlineUsers', (userIds) => {
			set({ onlineUsers: userIds })
		})

		socket.on('newMessage', ({ message, conversation, unreadCounts }) => {
			useChatStore.getState().addMessage(message)

			const LastMessage = {
				_id: conversation.lastMessage._id,
				content: conversation.lastMessage.content,
				createAt: conversation.lastMessage.createAt,
				sender: {
					_id: conversation.lastMessage.sender._id,
					displayName: '',
					avatarUrl: null,
				},
			}

			const updatedConversation = {
				...conversation,
				lastMessage: LastMessage,
				unreadCounts: unreadCounts,
			}

			if (useChatStore.getState().activeConversationId !== message._id) {
				// Mark read message if the conversation is active
			}

			useChatStore.getState().updateConversation(updatedConversation)
		})
	},
	disconnectSocket: () => {
		const socket = get().socket
		if (socket) {
			socket.disconnect()
			set({ socket: null })
		}
	},
}))
