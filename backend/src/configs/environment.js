import 'dotenv/config'

export const env = {
	PORT: process.env.PORT || 5001,

	MONGODB_URI: process.env.MONGODB_URI,

	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,

	CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
}
