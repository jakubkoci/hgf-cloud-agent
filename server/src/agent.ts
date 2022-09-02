import { agentDependencies } from '@aries-framework/node'
import {
  Agent,
  ConsoleLogger,
  InitConfig,
  LogLevel,
} from '@aries-framework/core'
import dotenv from 'dotenv-safe'
import {
  pool_transactions_buildernet_genesis,
  pool_transactions_localhost_genesis,
} from './txns'

dotenv.config()

const ledgers = {
  localhost: {
    id: `pool-localhost-cloud-agent`,
    isProduction: false,
    genesisTransactions: pool_transactions_localhost_genesis,
    transactionAuthorAgreement: {
      version: '1',
      acceptanceMechanism: 'accept',
    },
  },
  buildernet: {
    id: `pool-buildernet-cloud-agent`,
    isProduction: false,
    genesisTransactions: pool_transactions_buildernet_genesis,
    transactionAuthorAgreement: {
      version: '0.1',
      acceptanceMechanism: 'service_agreement',
    },
  },
}

function createAgent(): Agent {
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
    logger: new ConsoleLogger(LogLevel.debug),
    // @ts-ignore: I don't understand why TS complains here with the messaage "Type 'string' is not
    // assignable to type '`${number}` | `${number}.${number}`'"
    indyLedgers: [ledgers.buildernet],
  }
  return new Agent(agentConfig, agentDependencies)
}

export { createAgent }
