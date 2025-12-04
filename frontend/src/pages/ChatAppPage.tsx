import Logout from '@/components/auth/Logout'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'

const ChatAppPage = () => {
	const user = useAuthStore((state) => state.user) // Access user details if needed

	const handleOnClick = async () => {
		try {
			await api.get('/users/test', { withCredentials: true })

			toast.success('Test request successful!')
		} catch (error) {
			console.error(error)
			toast.error('Test request failed.')
		}
	}

	return (
		<div>
			{user && <h1>Welcome to ChatChit, {user.displayName}!</h1>}
			<Logout />

			<Button onClick={handleOnClick}> test</Button>
		</div>
	)
}

export default ChatAppPage
