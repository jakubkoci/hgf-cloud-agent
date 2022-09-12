import {
  pool_transactions_bcovrin_greenlight_genesis,
  pool_transactions_bcovrin_test_genesis,
  pool_transactions_buildernet_genesis,
  pool_transactions_indicio_testnet_genesis,
  pool_transactions_localhost_genesis,
} from './txns'

export const ledgers = {
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
  bcovrin_test: {
    id: `pool-bcovrin-test-cloud-agent`,
    isProduction: false,
    genesisTransactions: pool_transactions_bcovrin_test_genesis,
  },
  bcovrin_greenlight: {
    id: `pool-bcovrin-greenlight-cloud-agent`,
    isProduction: false,
    genesisTransactions: pool_transactions_bcovrin_greenlight_genesis,
  },
  indicio_testnet: {
    id: `pool-bcovrin-indicio-testnet-cloud-agent`,
    isProduction: false,
    genesisTransactions: pool_transactions_indicio_testnet_genesis,
  },
} as const
