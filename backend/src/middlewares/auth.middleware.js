import jwt from 'jsonwebtoken'
import { env } from '../configs/environment.js'
import User from '../models/User.model.js'
import { StatusCodes } from 'http-status-codes'

export const authMiddleware = async (req, res, next) => {
	try {
		// Get access token from header
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

		if (!token)
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Unauthorized! No token provided.' })

		// Verify token
		jwt.verify(token, env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
			if (err) {
				console.log(err)

				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: 'Forbidden! Token invalid or expired.' })
			}

			// Find user by ID
			const user = await User.findById(decoded.userId).select(
				'-hashedPassword'
			)

			if (!user) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: 'Unauthorized! User not found.' })
			}

			// Attach user to request object
			req.user = user

			// Proceed to next middleware or route handler
			next()
		})
	} catch (error) {
		console.error('Error in protectedRoute middleware:', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal Server Error' })
	}
}
