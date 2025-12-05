import mongoose from 'mongoose'

const participantSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		_id: false, // Prevent creation of an _id field for subdocuments
	}
)

const groupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		avatarUrl: {
			type: String,
			trim: true,
		},
		avatarId: {
			type: String,
			trim: true,
		},
	},
	{
		_id: false, // Prevent creation of an _id field for subdocuments
	}
)

const lastMessageSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
		},
		content: {
			type: String,
			default: null,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		createdAt: {
			type: Date,
			default: null,
		},
	},
	{
		_id: false, // Prevent creation of an _id field for subdocuments
	}
)

const conversationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['direct', 'group'],
			required: true,
		},
		participant: {
			type: [participantSchema],
			required: true,
		},
		group: {
			type: groupSchema,
		},
		lastMessageAt: {
			type: Date,
		},
		sendBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
		lastMessage: {
			type: lastMessageSchema,
		},
		unreadCounts: {
			type: Map,
			of: Number,
			default: {},
		},
	},
	{
		timestamps: true,
	}
)

conversationSchema.index({ 'participant.userId': 1, lastMessageAt: -1 })

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation
