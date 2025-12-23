import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { env } from '../configs/environment.js'

export const socketAuthMiddleware = async (socket, next) => {
	try {
		// Get token from handshake auth
		const token = socket.handshake.auth.token

		// If no token, return error
		if (!token) {
			return next(new Error('Authentication error: Token not provided'))
		}

		const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET)

		// If token is invalid, return error
		if (!decoded) {
			return next(new Error('Authentication error: Invalid token'))
		}

		const user = await User.findById(decoded.userId).select(
			'-hashedPassword'
		)

		// If user not found, return error
		if (!user) {
			return next(new Error('Authentication error: User not found'))
		}

		// Attach user to socket object
		socket.user = user

		next()
	} catch (error) {
		console.error('Socket authentication error:', error)
		next(new Error('Authentication error'))
	}
}
