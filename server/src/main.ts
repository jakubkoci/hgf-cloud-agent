import dotenv from 'dotenv-safe'
import { startServer } from './server'
import { createAgent } from './agent'

dotenv.config()

const mediatorAgent = createAgent()
startServer(mediatorAgent, { port: Number(process.env.PORT) || 3001 })
