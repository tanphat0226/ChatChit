import express from 'express'
import { UserController } from '../controllers/user.controller.js'

const Router = express.Router()

Router.get('/me', UserController.authMe)

Router.get('/test', UserController.test)

export const userRoute = Router
