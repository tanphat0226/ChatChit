import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'

const signup = async (req, res) => {
	try {
		const { username, password, email, firstName, lastName } = req.body

		// Validate required fields
		if (!username || !password || !email || !firstName || !lastName) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'All fields are required' })
		}

		// Check existing user
		const existingUser = await User.findOne({
			$or: [{ username }, { email }],
		})

		if (existingUser) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ message: 'User already exists' })
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10) // 10 salt rounds

		// Create new user
		await User.create({
			username,
			email,
			hashedPassword,
			displayName: `${firstName} ${lastName}`,
		})

		// Return no content status
		return res.status(StatusCodes.CREATED).send({
			message: 'User created successfully',
		})
	} catch (error) {
		console.error('Error during Signup Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal Server Error',
		})
	}
}

export const AuthController = {
	signup,
}
