import { StatusCodes } from 'http-status-codes'

const authMe = (req, res) => {
	try {
		const user = req.user

		return res.status(StatusCodes.OK).json({ user })
	} catch (error) {
		console.log('Error during authMe in User Controller: ', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal Server Error' })
	}
}

const test = (req, res) => {
	return res.sendStatus(StatusCodes.NO_CONTENT)
}

export const UserController = {
	authMe,
	test,
}
