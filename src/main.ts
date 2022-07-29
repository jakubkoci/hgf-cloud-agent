import { startServer } from './server'
import { createAgent } from './agent'

const mediatorAgent = createAgent()
startServer(mediatorAgent, { port: 3001 })
