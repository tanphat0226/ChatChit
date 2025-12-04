import cookieParser from 'cookie-parser'
import express from 'express'
import { ROUTES } from './routes/index.js'
import cors from 'cors'

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: env.CLIENT_URL,
		credentials: true,
	})
)

// Connect to database
import '../src/libs/db.js'
import { env } from './configs/environment.js'

// Use Routes
app.use('/api', ROUTES)

export default app
