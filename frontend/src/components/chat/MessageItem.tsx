import { cn, formatMessageTime } from '@/lib/utils'
import type { Conversation, Message, Participant } from '@/types/chat'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import UserAvatar from './UserAvatar'

const TIME_DIFF_FOR_GROUP_BREAK = 5 * 60 * 1000 // 5 minutes

interface MessageItemProps {
	message: Message
	index: number
	messages: Message[]
	selectedConvo: Conversation
	lastMessageStatus: 'delivered' | 'seen'
}

const MessageItem = ({
	message,
	index,
	messages,
	selectedConvo,
	lastMessageStatus,
}: MessageItemProps) => {
	// Get the previous message if it exists
	const prev = messages[index - 1]

	// Determine if this message is the start of a new group
	const isGroupBreak =
		index === 0 ||
		message.senderId !== prev?.senderId ||
		new Date(message.createdAt).getTime() -
			new Date(prev.createdAt || 0).getTime() >
			TIME_DIFF_FOR_GROUP_BREAK

	// Find the participant who sent this message
	const participant = selectedConvo.participants.find(
		(p: Participant) => p._id.toString() === message.senderId.toString()
	)

	return (
		<div
			className={cn(
				'flex gap-2 message-bounce mt-1',
				message.isOwn ? 'justify-end' : 'justify-start'
			)}
		>
			{/* Avatar */}
			{!message.isOwn && (
				<div className='w-8'>
					{isGroupBreak && (
						<UserAvatar
							type='chat'
							name={participant?.displayName ?? 'User'}
							avatarUrl={participant?.avatarUrl || undefined}
						/>
					)}
				</div>
			)}

			{/* Message */}
			<div
				className={cn(
					'max-w-xs lg:max-w-md space-y-1 flex flex-col',
					message.isOwn ? 'justify-end' : 'justify-start'
				)}
			>
				<Card
					className={cn(
						'p-3 ',
						message.isOwn
							? 'chat-bubble-sent border-0'
							: 'bg-chat-bubble-received'
					)}
				>
					<p className='text-sm leading-relaxed wrap-break-words'>
						{message.content}
					</p>
				</Card>

				<div className='flex items-center mt-0.5'>
					{/* Status: delivered or seen */}
					{message.isOwn &&
						message._id === selectedConvo.lastMessage?._id && (
							<>
								<Badge
									variant='outline'
									className={cn(
										'text-xs px-1.5 py-0.5 h-4 border-0',
										lastMessageStatus === 'seen'
											? 'bg-primary/20 text-primary'
											: 'bg-muted text-muted-foreground'
									)}
								>
									{lastMessageStatus.charAt(0).toUpperCase() +
										lastMessageStatus.slice(1)}
								</Badge>

								<span className='px-0.5 text-xs text-muted-foreground/50'>
									|
								</span>
							</>
						)}

					{/* Timestamp*/}
					{isGroupBreak && (
						<span className='text-xs text-muted-foreground px-1'>
							{formatMessageTime(new Date(message.createdAt))}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default MessageItem
