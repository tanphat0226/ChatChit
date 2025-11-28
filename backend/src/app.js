import express from 'express'
import { ROUTES } from './routes/index.js'

const app = express()

// Middlewares
app.use(express.json())

// Connect to database
import '../src/libs/db.js'

// Use Routes
app.use('/api', ROUTES)

export default app
