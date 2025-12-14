import express from 'express'
import { authRoute } from './auth.route.js'
import { userRoute } from './user.route.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { friendRoute } from './friend.route.js'
import { messageRoute } from './message.route.js'
import { conversationRoute } from './conversation.route.js'

const Router = express.Router()

// PUBLIC Routes
Router.use('/auth', authRoute)

// PRIVATE Routes
Router.use(authMiddleware)
Router.use('/users', userRoute)
Router.use('/friends', friendRoute)
Router.use('/messages', messageRoute)
Router.use('/conversations', conversationRoute)

export const ROUTES = Router
