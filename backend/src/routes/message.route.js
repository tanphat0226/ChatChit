import express from 'express'
import { MessageController } from '../controllers/message.controller.js'
import {
	verifyFriendship,
	verifyGroupMembership,
} from '../middlewares/friend.middleware.js'

const Router = express.Router()

Router.post('/direct', verifyFriendship, MessageController.sendDirectMessage)

Router.post('/group', verifyGroupMembership, MessageController.sendGroupMessage)

export const messageRoute = Router
