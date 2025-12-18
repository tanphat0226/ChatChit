import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import type { Conversation } from '@/types/chat'
import ChatCard from './ChatCard'
import GroupChatAvatar from './GroupChatAvatar'
import UnreadCountBadge from './UnreadCountBadge'

const GroupChatCard = ({ convo }: { convo: Conversation }) => {
	const { user } = useAuthStore()
	const { activeConversationId, setActiveConversation, message } =
		useChatStore()

	if (!user) return null

	const unreadCount = convo.unreadCounts[user._id]
	const name = convo.group?.name ?? ''

	const handleSelectConversation = async (id: string) => {
		setActiveConversation(id)
		if (!message[id]) {
			// TODO: Fetch messages for this conversation if not already loaded
		}
	}

	return (
		<ChatCard
			convoId={convo._id}
			name={name}
			timestamp={
				convo.lastMessage?.createdAt
					? new Date(convo.lastMessage.createdAt)
					: undefined
			}
			isActive={activeConversationId === convo._id}
			onSelect={handleSelectConversation}
			leftSection={
				<>
					{unreadCount > 0 && (
						<UnreadCountBadge unreadCount={unreadCount} />
					)}
					<GroupChatAvatar
						participants={convo.participants}
						type='chat'
					/>
				</>
			}
			subtitle={
				<p className={'text-xs truncate text-muted-foreground'}>
					{convo.participants.length}{' '}
					{convo.participants.length === 1 ? 'member' : 'members'}
				</p>
			}
		/>
	)
}

export default GroupChatCard
