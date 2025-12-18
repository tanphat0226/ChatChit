import type { Conversation } from '@/types/chat'
import ChatCard from './ChatCard'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { cn } from '@/lib/utils'
import UserAvatar from './UserAvatar'
import StatusBadge from './StatusBadge'
import UnreadCountBadge from './UnreadCountBadge'

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
	const { user } = useAuthStore()
	const { activeConversationId, setActiveConversation, message } =
		useChatStore()

	if (!user) return null

	const otherUser = convo.participants.find(
		(participant) => participant._id !== user._id
	)

	if (!otherUser) return null

	const unreadCount = convo.unreadCounts[user._id]
	const lastMessage = convo.lastMessage?.content ?? ''

	const handleSelectConversation = async (id: string) => {
		setActiveConversation(id)
		if (!message[id]) {
			// TODO: Fetch messages for this conversation if not already loaded
		}
	}

	return (
		<ChatCard
			convoId={convo._id}
			name={otherUser.displayName}
			timestamp={
				convo.lastMessage?.createdAt
					? new Date(convo.lastMessage.createdAt)
					: undefined
			}
			isActive={activeConversationId === convo._id}
			onSelect={handleSelectConversation}
			leftSection={
				<>
					<UserAvatar
						type='sidebar'
						name={otherUser.displayName ?? ''}
						avatarUrl={otherUser.avatarUrl ?? undefined}
					/>
					{/* Todo: Socket connection status */}
					<StatusBadge status='offline' />
					{unreadCount > 0 && (
						<UnreadCountBadge unreadCount={unreadCount} />
					)}
				</>
			}
			subtitle={
				<p
					className={cn(
						'text-xs truncate',
						unreadCount
							? 'font-medium text-foreground'
							: 'text-muted-foreground'
					)}
				>
					{lastMessage}
				</p>
			}
		/>
	)
}

export default DirectMessageCard
