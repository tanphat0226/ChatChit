'use strict'
import mongoose from 'mongoose'
import { env } from '../configs/envỉonment.js'

class Database {
	constructor() {
		this.connect()
	}

	// Connect to MongoDB
	async connect() {
		try {
			await mongoose.connect(env.MONGODB_URI)
			console.log('Connected To MongoDB Successfully')
		} catch (error) {
			console.error('Error Connecting To MongoDB', error)
		}
	}

	// Get instance
	static getInstance() {
		if (!this.instance) {
			this.instance = new Database()
		}
		return this.instance
	}
}

// Create instance
const instanceMongodb = Database.getInstance()

// Export instance
export default instanceMongodb
