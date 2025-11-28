import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true, // When true, Mongoose adds a unique index in MongoDB
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		displayName: {
			type: String,
			required: true,
			trim: true,
		},
		avatarUrl: {
			type: String, // CDN Url
		},
		avatarId: {
			type: String, // Cloudinary public_id
		},
		bio: {
			type: String,
			maxLength: 500,
		},
		phone: {
			type: String,
			default: null,
			trim: true,
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
)

// Create a partial unique index on phone field to allow multiple nulls
userSchema.index(
	{ phone: 1 },
	{
		unique: true,
		// Only enforce uniqueness when phone is not null
		partialFilterExpression: { phone: { $ne: null } },
	}
)

const User = mongoose.model('User', userSchema)

export default User
