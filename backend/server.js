import server from './src/app.js'
import { env } from './src/configs/environment.js'

// Listen server
const serverInstance = server.listen(env.PORT, () => {
	console.log(`Server is running on port ${env.PORT}`)
})

/**
 * Gracefully shuts down the server on SIGINT signal (e.g., Ctrl+C).
 * It stops the server from accepting new connections and waits for
 * existing connections to close before exiting.
 */
process.on('SIGINT', () => {
	serverInstance.close(() => {
		console.log('Exit Server Express')
	})
})
