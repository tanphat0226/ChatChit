import { useAuthStore } from '@/stores/useAuthStore'
import type { Conversation } from '@/types/chat'
import { useState } from 'react'
import { Button } from '../ui/button'
import { ImagePlus, Send } from 'lucide-react'
import { Input } from '../ui/input'
import EmojiPicker from './EmojiPicker'
import { emoji } from 'zod'

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
	const { user } = useAuthStore()
	const [value, setValue] = useState('')

	if (!user) return

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
				className='bg-gradient-chat hover:shadow-glow transition-all hover:scale-105'
				disabled={!value.trim()}
			>
				<Send className='size-4 text-white' />
			</Button>
		</div>
	)
}

export default MessageInput
