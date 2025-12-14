import { StatusCodes } from 'http-status-codes'

import Friend from '../models/Friend.model.js'
import Conversation from '../models/conversation.model.js'

// Helper function to create a consistent key for friendship pairs
const pair = (a, b) => (a < b ? [a, b] : [b, a])

export const verifyFriendship = async (req, res, next) => {
	try {
		const me = req.user._id.toString()
		const recipientId = req.body?.recipientId ?? null
		const memberIds = req.body?.memberIds ?? []

		if (!recipientId && memberIds.length === 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Recipient ID or member IDs are required' })
		}

		if (recipientId) {
			const [userA, userB] = pair(me, recipientId)

			const isFriend = await Friend.findOne({ userA, userB })

			if (!isFriend) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: 'You are not friends with this user.' })
			}

			return next()
		}

		// Check friendships for group members
		const friendChecks = memberIds.map(async (memberId) => {
			const [userA, userB] = pair(me, memberId)
			const isFriend = await Friend.findOne({ userA, userB })

			return isFriend ? null : memberId
		})

		// Await all friendship checks
		const results = await Promise.all(friendChecks)

		// Filter out nulls to get non-friend IDs
		const notFriends = results.filter(Boolean)

		// If there are any non-friends, return an error
		if (notFriends.length > 0) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message: `You only can add friends to the group. ${notFriends.join(
					', '
				)}`,
			})
		}

		return next()
	} catch (error) {
		console.error('Error in verifyFriendship middleware:', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal server error' })
	}
}

export const verifyGroupMembership = async (req, res, next) => {
	try {
		const { conversationId } = req.body
		const userId = req.user._id.toString()

		const conversation = await Conversation.findById(conversationId)
		if (!conversation) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Conversation not found' })
		}

		const isMember = conversation.participants.some(
			(p) => p.userId.toString() === userId
		)

		if (!isMember) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'You are not a member of this group.' })
		}

		req.conversation = conversation
		return next()
	} catch (error) {
		console.error('Error in verifyGroupMembership middleware:', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal server error' })
	}
}
