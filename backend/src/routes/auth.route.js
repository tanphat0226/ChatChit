import express from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const Router = express.Router()

Router.post('/signup', AuthController.signUp)

Router.post('/signin', AuthController.signIn)

Router.post('/signout', AuthController.signOut)

Router.post('/refresh', AuthController.refreshToken)

export const authRoute = Router
