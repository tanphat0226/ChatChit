import express from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const Router = express.Router()

Router.post('/signup', AuthController.signup)

export const authRoute = Router
