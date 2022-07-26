import { startServer } from './server'
import { createAgent } from './agent'
import config from './config'

const mediatorAgent = createAgent(config)
startServer(mediatorAgent, { port: 3001 })
