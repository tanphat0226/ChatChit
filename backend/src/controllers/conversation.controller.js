import { StatusCodes } from 'http-status-codes'
import { CONVERSATION_TYPES } from '../../utils/contants.js'
import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

const LIMIT_MESSAGES = 50

const createConversation = async (req, res) => {
	try {
		const { type, name, memberIds } = req.body

		const userId = req.user._id

		if (
			!type ||
			(type === CONVERSATION_TYPES.GROUP && !name) ||
			!memberIds ||
			!Array.isArray(memberIds) ||
			memberIds.length === 0
		) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message:
					'Group conversations require a name and at least one member ID.',
			})
		}

		let conversation

		// Handle direct conversation creation
		if (type === CONVERSATION_TYPES.DIRECT) {
			const participantIds = memberIds[0]

			conversation = await Conversation.findOne({
				type: CONVERSATION_TYPES.DIRECT,
				'participants.userId': { $all: [userId, participantIds] },
			})

			if (!conversation) {
				conversation = await Conversation.create({
					type: CONVERSATION_TYPES.DIRECT,
					participants: [{ userId }, { userId: participantIds }],
					lastMessageAt: new Date(),
				})

				await conversation.save()
			}
		}

		// Handle group conversation creation
		if (type === CONVERSATION_TYPES.GROUP) {
			// Create new group conversation
			conversation = await Conversation.create({
				type: CONVERSATION_TYPES.GROUP,
				participants: [
					{ userId },
					...memberIds.map((id) => ({ userId: id })),
				],
				group: { name, createdBy: userId },
				lastMessageAt: new Date(),
			})

			// Save the new conversation
			await conversation.save()
		}

		// If conversation creation failed
		if (!conversation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Invalid conversation type.',
			})
		}

		// Populate participants' user details before sending response
		await conversation.populate([
			{ path: 'participants.userId', select: 'displayName avatarUrl' },
			{
				path: 'seenBy',
				select: 'displayName avatarUrl',
			},
			{ path: 'lastMessage.senderId', select: 'displayName avatarUrl' },
		])

		// Return the created conversation
		return res.status(StatusCodes.CREATED).json({ conversation })
	} catch (error) {
		console.error('Error creating conversation:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const getConversations = async (req, res) => {
	try {
		const userId = req.user._id

		const conversations = await Conversation.find({
			'participants.userId': userId,
		})
			.sort({ lastMessageAt: -1, updatedAt: -1 })
			.populate([
				{
					path: 'participants.userId',
					select: 'displayName avatarUrl',
				},
				{
					path: 'lastMessage.senderId',
					select: 'displayName avatarUrl',
				},
				{
					path: 'seenBy',
					select: 'displayName avatarUrl',
				},
			])

		const formatted = conversations.map((conv) => {
			const participants = (conv.participants || []).map((p) => ({
				_id: p.userId?._id,
				displayName: p.userId?.displayName,
				avatarUrl: p.userId?.avatarUrl ?? null,
				joinedAt: p.joinedAt,
			}))

			return {
				...conv.toObject(),
				unreadCounts: conv.unreadCounts || {},
				participants,
			}
		})

		return res.status(StatusCodes.OK).json({ conversations: formatted })
	} catch (error) {
		console.error('Error fetching conversations:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const getMessages = async (req, res) => {
	try {
		const { conversationId } = req.params
		const { limit = LIMIT_MESSAGES, cursor } = req.query

		const query = { conversationId }

		// Apply cursor for pagination
		if (cursor) {
			query.createdAt = { $lt: new Date(cursor) } // lt means "less than"
		}

		let messages = await Message.find(query)
			.sort({ createdAt: -1 }) // newest to oldest
			.limit(Number(limit) + 1) // fetch one extra to check for more

		let nextCursor = null

		// Determine if there's a next page
		if (messages.length > Number(limit)) {
			const nextMessage = messages[messages.length - 1]

			nextCursor = nextMessage.createdAt.toISOString()
			messages.pop() // remove the extra message
		}

		messages = messages.reverse() // oldest to newest

		return res.status(StatusCodes.OK).json({ messages, nextCursor })
	} catch (error) {
		console.error('Error fetching messages:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

export const ConversationController = {
	createConversation,
	getConversations,
	getMessages,
}
