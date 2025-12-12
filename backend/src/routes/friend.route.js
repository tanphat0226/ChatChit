import express from 'express'
import { FriendController } from '../controllers/friend.controller.js'

const Router = express.Router()

Router.post('/requests', FriendController.sendFriendRequest)

Router.post('/unfriend/:friendId', FriendController.unFriend)

Router.post('/requests/:requestId/accept', FriendController.acceptFriendRequest)

Router.post(
	'/requests/:requestId/decline',
	FriendController.declineFriendRequest
)

Router.get('/', FriendController.getAllFriends)
Router.get('/requests', FriendController.getFriendRequests)

export const friendRoute = Router
