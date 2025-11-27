import express from 'express'

const app = express()

// Middlewares
app.use(express.json())

// Connect to database
import '../libs/db.js'

export default app
