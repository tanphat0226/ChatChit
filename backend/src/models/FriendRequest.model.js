import mongoose from 'mongoose'

const friendRequestSchema = new mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			maxLength: 300,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
)

// Ensure a user cannot send multiple friend requests to the same user
friendRequestSchema.pre('save', function (next) {
	if (!this.from || !this.to)
		return next(new Error('from and to are required'))

	const fromStr = this.from.toString()
	const toStr = this.to.toString()

	if (fromStr === toStr)
		return next(new Error('Cannot send friend request to yourself'))

	next()
})

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true })

friendRequestSchema.index({ from: 1 })
friendRequestSchema.index({ to: 1 })

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema)

export default FriendRequest
