import { StatusCodes } from 'http-status-codes'
import { CONVERSATION_TYPES } from '../../utils/contants.js'
import { updateConversationAfterCreateMessage } from '../../utils/messageHelper.js'
import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

const sendDirectMessage = async (req, res) => {
	try {
		const { recipientId, content, conversationId } = req.body
		const senderId = req.user._id
		let conversation

		if (!content) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Message content is required',
			})
		}

		if (conversationId) {
			// Use existing conversation
			conversation = await Conversation.findById(conversationId)
		}

		// If no conversation, create a new one
		if (!conversation) {
			conversation = await Conversation.create({
				type: CONVERSATION_TYPES.DIRECT,
				participants: [
					{ userId: senderId, joinedAt: new Date() },
					{ userId: recipientId, joinedAt: new Date() },
				],
				lastMessageAt: new Date(),
				unreadCounts: new Map(),
			})
		}

		// Create the message
		const message = await Message.create({
			conversationId: conversation._id,
			senderId,
			content,
		})

		// Update conversation metadata
		await updateConversationAfterCreateMessage(
			conversation,
			message,
			senderId
		)

		// Save the updated conversation
		await conversation.save()

		// Respond with the created message
		return res.status(StatusCodes.CREATED).json({ message })
	} catch (error) {
		console.log(
			'Error during sendDirectMessage in Message Controller: ',
			error
		)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal Server Error' })
	}
}

const sendGroupMessage = async (req, res) => {
	try {
		const { conversationId, content } = req.body
		const senderId = req.user._id
		const conversation = req.conversation

		if (!content) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Message content is required',
			})
		}

		const newMessage = await Message.create({
			conversationId: conversation._id,
			senderId,
			content,
		})

		updateConversationAfterCreateMessage(conversation, newMessage, senderId)

		await conversation.save()

		return res.status(StatusCodes.CREATED).json({ message: newMessage })
	} catch (error) {
		console.error(
			'Error during sendGroupMessage in Message Controller: ',
			error
		)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal Server Error' })
	}
}

export const MessageController = {
	sendDirectMessage,
	sendGroupMessage,
}
