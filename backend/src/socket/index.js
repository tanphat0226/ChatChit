import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { env } from '../configs/environment.js'
import { ConversationController } from '../controllers/conversation.controller.js'
import { socketAuthMiddleware } from '../middlewares/socket.middleware.js'

const app = express()
const server = createServer(app)

const io = new Server(server, {
	cors: {
		origin: env.CLIENT_URL,
		credentials: true,
	},
})

io.use(socketAuthMiddleware)

const onlineUsers = new Map() // {userId: socketId} to track online users . If largre scale, consider using Redis or similar.

io.on('connection', async (socket) => {
	const user = socket.user
	console.log(`${user.displayName} connected with socket ID: ${socket.id}`)

	onlineUsers.set(user._id.toString(), socket.id)

	io.emit('onlineUsers', Array.from(onlineUsers.keys()))

	const conversationIds =
		await ConversationController.getUserConversationsForSocket(user._id)

	conversationIds.forEach((conversationId) => {
		socket.join(conversationId)
	})

	socket.on('disconnect', () => {
		console.log(
			`${user.displayName} disconnected from socket ID: ${socket.id}`
		)

		onlineUsers.delete(user._id.toString())

		io.emit('onlineUsers', Array.from(onlineUsers.keys()))
	})
})

export { app, io, server }
