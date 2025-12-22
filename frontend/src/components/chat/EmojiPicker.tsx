import { useThemeStore } from '@/stores/useThemeStore'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Smile } from 'lucide-react'
import { Popover } from '../ui/popover'

interface EmojiPickerProps {
	onChange: (emoji: string) => void
}
const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
	const { isDarkMode } = useThemeStore()

	return (
		<Popover>
			<PopoverTrigger className='cursor-pointer'>
				<Smile className='size-4' />
			</PopoverTrigger>

			{/* Popover Content */}
			<PopoverContent
				align='end'
				className='bg-transparent border-none shadow-none drop-shadow-none mb-8'
			>
				<Picker
					theme={isDarkMode ? 'dark' : 'light'}
					data={data}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					onEmojiSelect={(emoji: any) => onChange(emoji.native)}
					emojiSize={24}
				/>
			</PopoverContent>
		</Popover>
	)
}

export default EmojiPicker
