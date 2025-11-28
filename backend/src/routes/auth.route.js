import express from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const Router = express.Router()

Router.post('/signup', AuthController.signUp)

Router.post('/signin', AuthController.signIn)

Router.get('/signout', AuthController.signOut)

export const authRoute = Router
