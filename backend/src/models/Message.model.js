import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
			index: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			trim: true,
		},
		imgUrl: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
)

// Compound index to optimize queries fetching messages by conversationId sorted by createdAt
messageSchema.index({ conversationId: 1, createdAt: -1 })

const Message = mongoose.model('Message', messageSchema)

export default Message
