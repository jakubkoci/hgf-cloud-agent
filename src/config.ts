import { ConsoleLogger, InitConfig, LogLevel } from '@aries-framework/core'
import dotenv from 'dotenv-safe'

dotenv.config()

const agentConfig: InitConfig = {
  endpoints: process.env.AGENT_ENDPOINTS?.split(','),
  label: process.env.AGENT_LABEL || '',
  walletConfig: {
    id: process.env.WALLET_NAME || '',
    key: process.env.WALLET_KEY || '',
  },
  autoUpdateStorageOnStartup: true,
  publicDidSeed: process.env.PUBLIC_DID_SEED || '',
  autoAcceptConnections: true,
  autoAcceptMediationRequests: true,
  logger: new ConsoleLogger(LogLevel.info),
}

export default agentConfig
