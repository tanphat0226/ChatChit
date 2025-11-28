import express from 'express'
import { authRoute } from './auth.route.js'
import { userRoute } from './user.route.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const Router = express.Router()

// PUBLIC Routes
Router.use('/auth', authRoute)

// PRIVATE Routes
Router.use(authMiddleware)
Router.use('/users', userRoute)

export const ROUTES = Router
