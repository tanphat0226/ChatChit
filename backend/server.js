import app from './src/app.js'
import { env } from './src/configs/environment.js'

// Listen server
const server = app.listen(env.PORT, () => {
	console.log(`Server is running on port ${env.PORT}`)
})

/**
 * Gracefully shuts down the server on SIGINT signal (e.g., Ctrl+C).
 * It stops the server from accepting new connections and waits for
 * existing connections to close before exiting.
 */
process.on('SIGINT', () => {
	server.close(() => {
		console.log('Exit Server Express')
	})
})
