import { StatusCodes } from 'http-status-codes'
import Friend from '../models/Friend.model.js'
import FriendRequest from '../models/FriendRequest.model.js'
import User from '../models/User.model.js'

const sendFriendRequest = async (req, res) => {
	try {
		const { to, message } = req.body
		const from = req.user._id

		if (from === to) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'You cannot send a friend request to yourself',
			})
		}

		// Check if the recipient user exists
		const userExists = await User.findById({ _id: to })

		if (!userExists) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'User not found',
			})
		}

		// Normalize user IDs to ensure consistent ordering
		let userA = from.toString()
		let userB = to.toString()

		if (userA > userB) {
			// Swap to maintain order
			;[userA, userB] = [userB, userA]
		}

		// Check if they are already friends or if a request is pending
		const [alreadyFriends, existingRequest] = await Promise.all([
			Friend.findOne({ userA, userB }),
			FriendRequest.findOne({
				$or: [
					{ from, to },
					{ from: to, to: from },
				],
			}),
		])

		if (alreadyFriends) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'You are already friends with this user',
			})
		}

		if (existingRequest) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Friend request already sent',
			})
		}

		// Create and save the new friend request
		const friendRequest = await FriendRequest.create({
			from,
			to,
			message,
		})

		await friendRequest.save()

		// Respond with success
		return res.status(StatusCodes.CREATED).json({
			message: 'Friend request sent successfully',
			request: friendRequest,
		})
	} catch (error) {
		console.error('Error during sendFriendRequest Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const acceptFriendRequest = async (req, res) => {
	try {
		const { requestId } = req.params
		const userId = req.user._id

		// Find the friend request
		const friendRequest = await FriendRequest.findById(requestId)

		if (!friendRequest) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'Friend request not found',
			})
		}

		// Check if the logged-in user is the recipient of the request
		if (friendRequest.to.toString() !== userId.toString()) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message: 'You are not authorized to accept this friend request',
			})
		}

		// Create a new friendship
		const friend = await Friend.create({
			userA: friendRequest.from,
			userB: friendRequest.to,
		})

		// After creating the friendship, delete the friend request
		await FriendRequest.findByIdAndDelete(requestId)

		// Then, fetch the user details of the requester
		const from = await User.findById(friendRequest.from)
			.select('_id displayName avatarUrl')
			.lean() // Convert to plain JS object

		// Respond with success
		return res.status(StatusCodes.OK).json({
			message: 'Friend request accepted successfully',
			newFriend: {
				_id: from?._id,
				displayName: from?.displayName,
				avatarUrl: from?.avatarUrl,
			},
		})
	} catch (error) {
		console.error('Error during acceptFriendRequest Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const declineFriendRequest = async (req, res) => {
	try {
		const { requestId } = req.params
		const userId = req.user._id

		const friendRequest = await FriendRequest.findById(requestId)
		if (!friendRequest) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'Friend request not found',
			})
		}

		if (friendRequest.to.toString() !== userId.toString()) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message:
					'You are not authorized to decline this friend request',
			})
		}

		// Delete the friend request
		await FriendRequest.findByIdAndDelete(requestId)

		// Respond with success
		return res.status(StatusCodes.OK).json({
			message: 'Friend request declined successfully',
		})
	} catch (error) {
		console.error('Error during declineFriendRequest Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const getAllFriends = async (req, res) => {
	try {
		const userId = req.user._id

		// Find all friendships involving the user
		const friendships = await Friend.find({
			$or: [{ userA: userId }, { userB: userId }],
		})
			.populate('userA', '_id displayName avatarUrl')
			.populate('userB', '_id displayName avatarUrl')
			.lean()

		// If no friends found, return an empty array
		if (!friendships.length) {
			return res.status(StatusCodes.OK).json({
				message: 'No friends found',
				friends: [],
			})
		}

		// Extract friend details
		const friends = friendships.map((friendship) =>
			friendship.userA._id.toString() === userId.toString()
				? friendship.userB
				: friendship.userA
		)

		// Respond with the list of friends
		return res.status(StatusCodes.OK).json({
			message: 'Friends fetched successfully',
			friends,
		})
	} catch (error) {
		console.error('Error during getAllFriends Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const getFriendRequests = async (req, res) => {
	try {
		const userId = req.user._id
		const populateFields = '_id displayName avatarUrl username'

		const [sent, received] = await Promise.all([
			// Friend requests sent to the user
			FriendRequest.find({ from: userId })
				.populate('to', populateFields)
				.lean(),
			// Friend requests sent by the user
			FriendRequest.find({ to: userId })
				.populate('from', populateFields)
				.lean(),
		])

		// Respond with the friend requests
		return res.status(StatusCodes.OK).json({
			message: 'Friend requests fetched successfully',
			sent,
			received,
		})
	} catch (error) {
		console.error('Error during getFriendRequests Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

const unFriend = async (req, res) => {
	try {
	} catch (error) {
		console.error('Error during unFriend Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error',
		})
	}
}

export const FriendController = {
	sendFriendRequest,
	unFriend,
	acceptFriendRequest,
	declineFriendRequest,
	getFriendRequests,
	getAllFriends,
}
