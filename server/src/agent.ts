import { agentDependencies } from '@aries-framework/node'
import {
  Agent,
  ConsoleLogger,
  InitConfig,
  LogLevel,
} from '@aries-framework/core'
import {
  pool_transactions_bcovrin_genesis,
  pool_transactions_buildernet_genesis,
  pool_transactions_localhost_genesis,
} from './txns'

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
      version: '2.0',
      acceptanceMechanism: 'service_agreement',
    },
  },
  bcovrin: {
    id: `pool-bcovrin-cloud-agent`,
    isProduction: false,
    genesisTransactions: pool_transactions_bcovrin_genesis,
  },
} as const

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
    indyLedgers: [ledgers.buildernet],
  }
  return new Agent(agentConfig, agentDependencies)
}

export { createAgent }
