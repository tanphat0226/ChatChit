import mongoose from 'mongoose'

const friendSchema = new mongoose.Schema(
	{
		userA: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		userB: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

// Create a unique compound index to prevent duplicate friendships
friendSchema.pre('save', function (next) {
	// Ensure userA and userB are defined
	if (!this.userA || !this.userB)
		return next(new Error('userA and userB are required'))

	// Get string representations of the ObjectIds for comparison
	const userA = this.userA.toString()
	const userB = this.userB.toString()

	// Prevent a user from being friends with themselves
	if (userA === userB)
		return next(new Error('userA and userB must be different'))

	// If userA > userB, swap them to maintain consistent ordering
	if (userA > userB) {
		this.userA = new mongoose.Types.ObjectId(userB)
		this.userB = new mongoose.Types.ObjectId(userA)
	}

	next()
})

friendSchema.index({ userA: 1, userB: 1 }, { unique: true })

const Friend = mongoose.model('Friend', friendSchema)

export default Friend
