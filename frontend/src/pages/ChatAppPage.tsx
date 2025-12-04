import Logout from '@/components/auth/Logout'
import { useAuthStore } from '@/stores/useAuthStore'

const ChatAppPage = () => {
	const user = useAuthStore((state) => state.user) // Access user details if needed

	return (
		<div>
			{user && <h1>Welcome to ChatChit, {user.displayName}!</h1>}
			<Logout />
		</div>
	)
}

export default ChatAppPage
