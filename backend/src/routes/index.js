import express from 'express'
import { authRoute } from './auth.route.js'

const Router = express.Router()

// PUBLIC Routes
Router.use('/auth', authRoute)

// PRIVATE Routes

export const ROUTES = Router
