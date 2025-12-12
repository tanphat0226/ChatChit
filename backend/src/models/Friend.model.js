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
friendSchema.pre('save', function () {
	// Get string representations of the ObjectIds for comparison
	const userA = this.userA.toString()
	const userB = this.userB.toString()

	// If userA > userB, swap them to maintain consistent ordering
	if (userA > userB) {
		this.userA = new mongoose.Types.ObjectId(userB)
		this.userB = new mongoose.Types.ObjectId(userA)
	}
})

friendSchema.index({ userA: 1, userB: 1 }, { unique: true })

const Friend = mongoose.model('Friend', friendSchema)

export default Friend
