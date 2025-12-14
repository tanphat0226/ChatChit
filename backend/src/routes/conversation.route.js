import express from 'express'
import { ConversationController } from '../controllers/conversation.controller.js'
import { verifyFriendship } from '../middlewares/friend.middleware.js'

const Router = express.Router()

Router.post('/', verifyFriendship, ConversationController.createConversation)
Router.get('/', ConversationController.getConversations)
Router.get('/:conversationId/messages', ConversationController.getMessages)

export const conversationRoute = Router
