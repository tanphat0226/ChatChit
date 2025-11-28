import 'dotenv/config'

export const env = {
	PORT: process.env.PORT || 5001,

	MONGODB_URI: process.env.MONGODB_URI,
}
