import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import type { Conversation } from '@/types/chat'
import { ImagePlus, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import EmojiPicker from './EmojiPicker'
import { toast } from 'sonner'

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
	const { user } = useAuthStore()
	const { sendDirectMessage, sendGroupMessage } = useChatStore()
	const [value, setValue] = useState('')

	if (!user) return

	const handleSendMessage = async () => {
		if (!value.trim()) return
		const currentValue = value.trim()
		setValue('')

		try {
			if (selectedConvo.type === 'direct') {
				const participants = selectedConvo.participants
				const otherUser = participants.filter(
					(p) => p._id !== user._id
				)[0]

				await sendDirectMessage(otherUser._id, currentValue)
			} else {
				await sendGroupMessage(selectedConvo._id, currentValue)
			}
		} catch (error) {
			console.error('Error sending message:', error)
			toast.error('Failed to send message. Please try again.')
		} finally {
			setValue('')
		}
	}

	// Handle Enter key press to send message
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleSendMessage()
		}
	}

	return (
		<div className='flex items-center gap-2 p-3 min-h-14 bg-background'>
			{/* Image Upload Button */}
			<Button
				variant='ghost'
				size='icon'
				className='hover:bg-primary/10 transition-all'
			>
				<ImagePlus className='size-4' />
			</Button>

			{/* Message Input */}
			<div className='flex-1 relative'>
				<Input
					onKeyDown={handleKeyPress}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder='Type your message...'
					className='w-full pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-all resize-none'
				></Input>

				{/* Emoji Picker */}
				<div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
					<Button
						asChild
						variant='ghost'
						size='icon'
						className='size-8 hover:bg-primary/10 transition-all'
					>
						<div>
							<EmojiPicker
								onChange={(emoji: string) =>
									setValue(`${value}${emoji}`)
								}
							/>
						</div>
					</Button>
				</div>
			</div>

			{/* Send Button */}
			<Button
				onClick={handleSendMessage}
				className='bg-gradient-chat hover:shadow-glow transition-all hover:scale-105'
				disabled={!value.trim()}
			>
				<Send className='size-4 text-white' />
			</Button>
		</div>
	)
}

export default MessageInput
