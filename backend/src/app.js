import cookieParser from 'cookie-parser'
import express from 'express'
import { ROUTES } from './routes/index.js'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'

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

// Swagger Documentation
const swaggerDocument = JSON.parse(
	fs.readFileSync('./src/docs/swagger.json', 'utf8')
)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Connect to database
import '../src/libs/db.js'
import { env } from './configs/environment.js'

// Use Routes
app.use('/api', ROUTES)

export default app
