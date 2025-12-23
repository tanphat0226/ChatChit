import { useChatStore } from '@/stores/useChatStore'
import { SidebarInset } from '../ui/sidebar'
import ChatWelcomeScreen from './ChatWelcomeScreen'
import ChatWindowBody from './ChatWindowBody'
import ChatWindowHeader from './ChatWindowHeader'
import ChatWindowSkeleton from './ChatWindowSkeleton'
import MessageInput from './MessageInput'

const ChatWindowLayout = () => {
	const { activeConversationId, conversations, isMessageLoading, messages } =
		useChatStore()

	const selectedConversation =
		conversations.find((convo) => convo._id === activeConversationId) ??
		null

	if (!selectedConversation) {
		return <ChatWelcomeScreen />
	}

	if (isMessageLoading) {
		return <ChatWindowSkeleton />
	}

	return (
		<SidebarInset className='flex flex-col h-full flex-1 overflow-hidden rounded-sm shawdow-md'>
			{/* Header */}
			<ChatWindowHeader chat={selectedConversation} />

			{/* Body */}
			<div className='flex-1 overflow-y-auto bg-primary-foreground'>
				<ChatWindowBody />
			</div>

			{/* Footer */}
			<MessageInput selectedConvo={selectedConversation} />
		</SidebarInset>
	)
}

export default ChatWindowLayout
