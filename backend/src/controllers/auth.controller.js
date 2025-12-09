import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '../configs/environment.js'
import Session from '../models/Session.model.js'
import User from '../models/User.model.js'
import { log } from 'console'

const ACCESS_TOKEN_TTL = '30m' // Access token time to live
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000 // Refresh token time to live in milliseconds (14 days)

const signUp = async (req, res) => {
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

const signIn = async (req, res) => {
	try {
		const { username, password } = req.body

		//  Validate required fields
		if (!username || !password) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Username and password are required' })
		}

		// Find user by username
		const user = await User.findOne({ username })
		if (!user) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Invalid username or password' })
		}

		// Compare password
		const isPasswordValid = await bcrypt.compare(
			password,
			user.hashedPassword
		)

		if (!isPasswordValid) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Invalid username or password' })
		}

		// If valid, generate access token with JWT
		const accessToken = jwt.sign(
			{ userId: user._id, username: user.username },
			env.ACCESS_TOKEN_SECRET,
			{ expiresIn: ACCESS_TOKEN_TTL } // Access token valid for 15 minutes
		)

		// Generate refresh token with JWT
		const refreshToken = crypto.randomBytes(64).toString('hex')

		// Create new session or store refresh token in database
		await Session.create({
			userId: user._id,
			refreshToken,
			expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
		})

		// Return refresh token by setting it as an HTTP-only cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: REFRESH_TOKEN_TTL,
		})

		// Return data
		return res.status(StatusCodes.OK).json({
			message: `User ${user.displayName} signed in successfully`,
			accessToken,
		})
	} catch (error) {
		console.error('Error during SignIn Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal Server Error',
		})
	}
}

const signOut = async (req, res) => {
	try {
		// Get refresh token from cookies
		const token = req.cookies?.refreshToken

		if (token) {
			// Delete session from database
			await Session.deleteOne({ refreshToken: token })

			// Delete cookie
			res.clearCookie('refreshToken')
		}

		return res.sendStatus(StatusCodes.NO_CONTENT)
	} catch (error) {
		console.error('Error during SignOut Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal Server Error',
		})
	}
}

// Create new access token using refresh token
const refreshToken = async (req, res) => {
	try {
		// Get refresh token from cookies
		const token = req.cookies?.refreshToken

		if (!token) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Token not provided' })
		}

		// Compare with refresh token in database
		const session = await Session.findOne({ refreshToken: token })

		if (!session) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'Token invalid or expired' })
		}

		// Validate refresh token
		if (session.expiresAt < new Date()) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'Token expired' })
		}

		// If valid, generate new access token
		const accessToken = jwt.sign(
			{ userId: session.userId },
			env.ACCESS_TOKEN_SECRET,
			{ expiresIn: ACCESS_TOKEN_TTL }
		)

		// Return new access token
		return res.status(StatusCodes.OK).json({ accessToken })
	} catch (error) {
		console.error('Error during RefreshToken Controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal Server Error',
		})
	}
}

export const AuthController = {
	signUp,
	signIn,
	signOut,
	refreshToken,
}
