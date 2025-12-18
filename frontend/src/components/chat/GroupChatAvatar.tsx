import type { Participant } from '@/types/chat'
import { Ellipsis } from 'lucide-react'
import UserAvatar from './UserAvatar'

interface IGroupChatAvatarProps {
	participants: Participant[]
	type: 'chat' | 'sidebar'
}

const GroupChatAvatar = ({ participants, type }: IGroupChatAvatarProps) => {
	const avatars = []
	const limit = Math.min(participants.length, 4)

	for (let i = 0; i < limit; i++) {
		const member = participants[i]

		avatars.push(
			<UserAvatar
				key={i}
				type={type}
				name={member.displayName}
				avatarUrl={member.avatarUrl ?? undefined}
			/>
		)
	}

	return (
		<div className='relative flex -space-x-2 *:data-[slot=avater]:ring-background *:data-[slot=avater]:ring-2'>
			{avatars}

			{participants.length > limit && (
				<div className='flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2  ring-background text-muted-foreground'>
					<Ellipsis className='size-4' />
				</div>
			)}
		</div>
	)
}

export default GroupChatAvatar
