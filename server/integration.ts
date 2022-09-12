import { config } from 'dotenv-safe'
import {
  Agent,
  HttpOutboundTransport,
  WsOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  ConsoleLogger,
  CredentialEventTypes,
  CredentialState,
  ProofEventTypes,
  ProofState,
  AutoAcceptCredential,
  InitConfig,
  ProofStateChangedEvent,
  CredentialStateChangedEvent,
} from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import fetch from 'node-fetch-commonjs'
import {
  pool_transactions_bcovrin_greenlight_genesis,
  pool_transactions_bcovrin_test_genesis,
  pool_transactions_buildernet_genesis,
  pool_transactions_indicio_testnet_genesis,
  pool_transactions_localhost_genesis,
} from './src/txns'

config()

const autoRequestForCredential = false

export const ledgers = {
  localhost: {
    id: `pool-localhost-integration`,
    isProduction: false,
    genesisTransactions: pool_transactions_localhost_genesis,
  },
  buildernet: {
    id: `pool-buildernet-integration`,
    isProduction: false,
    genesisTransactions: pool_transactions_buildernet_genesis,
  },
  bcovrin_test: {
    id: `pool-bcovrin-test-integration`,
    isProduction: false,
    genesisTransactions: pool_transactions_bcovrin_test_genesis,
  },
  bcovrin_greenlight: {
    id: `pool-bcovrin-greenlight-integration`,
    isProduction: false,
    genesisTransactions: pool_transactions_bcovrin_greenlight_genesis,
  },
  indicio_testnet: {
    id: `pool-indicio-testnet-integration`,
    isProduction: false,
    genesisTransactions: pool_transactions_indicio_testnet_genesis,
  },
}

const cloudAgentUrl = process.env.AGENT_ENDPOINTS

const agentConfig = {
  label: 'afj-integration-script',
  walletConfig: {
    id: 'afj-integration-script',
    key: 'testkey0000000000000000000000000',
  },
  mediatorConnectionsInvite:
    'https://example.com/ssi?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiJhODM2OGZhMy05NTliLTRiNmItYjlmNS05OTMwMDg1YWY1ZDkiLCJsYWJlbCI6IkFic2FJZGVudGl0eU1lZGlhdG9yIiwiYWNjZXB0IjpbImRpZGNvbW0vYWlwMSIsImRpZGNvbW0vYWlwMjtlbnY9cmZjMTkiXSwiaGFuZHNoYWtlX3Byb3RvY29scyI6WyJodHRwczovL2RpZGNvbW0ub3JnL2RpZGV4Y2hhbmdlLzEuMCIsImh0dHBzOi8vZGlkY29tbS5vcmcvY29ubmVjdGlvbnMvMS4wIl0sInNlcnZpY2VzIjpbeyJpZCI6IiNpbmxpbmUtMCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHA6Ly8zNC4yNDkuMTE1Ljk5OjMwMDEiLCJ0eXBlIjoiZGlkLWNvbW11bmljYXRpb24iLCJyZWNpcGllbnRLZXlzIjpbImRpZDprZXk6ejZNa2h2Umt2UThjQUVQa1NxM3BBUnhHS2MzZ3NqV1VmNDl6VHY0ZndDVTlZUmZqIl0sInJvdXRpbmdLZXlzIjpbXX1dfQ',
  mediatorPickupStrategy: MediatorPickupStrategy.PickUpV1,
  logger: new ConsoleLogger(LogLevel.trace),
  connectToIndyLedgersOnStartup: false,
  indyLedgers: [ledgers.bcovrin_greenlight],
  autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
}

async function run() {
  const agent = await initializeAgent(agentConfig)
  try {
    const invitationUrl = await getInivitationUrl()

    let { connectionRecord } = await agent.oob.receiveInvitationFromUrl(
      invitationUrl
    )
    console.log('connectionRecord', connectionRecord)

    if (!connectionRecord) {
      throw new Error('No connection record created from invitation.')
    }
    connectionRecord = await agent.connections.returnWhenIsConnected(
      connectionRecord.id
    )
    console.log('connectionRecord connected', connectionRecord)

    if (connectionRecord === undefined) {
      throw new Error('Connection record created in connection process.')
    }

    const connectionsResponse = await fetch(`${cloudAgentUrl}/connections`)
    const connections: any = await connectionsResponse.json()
    const connection = connections.find(
      (c: any) => c.theirDid === connectionRecord!.did
    )
    if (!connection) {
      throw new Error(
        `Connection with theirDid ${connectionRecord.did} was not found.`
      )
    }
    console.log(`Connection with ID ${connection.id} was found`)

    addCredentialHandler(agent)
    addProofHandler(agent)

    if (autoRequestForCredential) {
      const issueCredentialResponse = await fetch(
        `${cloudAgentUrl}/issue-credential/${connection.id}`
      )
      if (!issueCredentialResponse.ok) {
        throw new Error(
          `HTTP response ${issueCredentialResponse.status} ${issueCredentialResponse.statusText}`
        )
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function initializeAgent(agentConfig: InitConfig) {
  const agent = new Agent(agentConfig, agentDependencies)
  agent.registerOutboundTransport(new WsOutboundTransport())
  agent.registerOutboundTransport(new HttpOutboundTransport())

  console.log('Initializing agent...')
  await agent.initialize()
  console.log('Initializing agent... Success')

  console.log('Connecting to ledger...')
  await agent.ledger.connectToPools()
  console.log('Connecting to ledger... Success')
  return agent
}

async function getInivitationUrl() {
  const response = await fetch(`${cloudAgentUrl}/invitation`)
  const invitationUrl = await response.text()
  console.log('invitationUrl', invitationUrl)
  return invitationUrl
}

function addCredentialHandler(agent: Agent) {
  agent.events.on(
    CredentialEventTypes.CredentialStateChanged,
    async (event: CredentialStateChangedEvent) => {
      console.log('CredentialStateChanged', event)
      const { credentialRecord } = event.payload
      if (credentialRecord.state === CredentialState.OfferReceived) {
        console.log(
          `credentialRecord ${credentialRecord.state}`,
          credentialRecord
        )
        console.log(`credentialRecord accepting offer`)
        agent.credentials.acceptOffer({
          credentialRecordId: credentialRecord.id,
        })
      }
      if (credentialRecord.state === CredentialState.CredentialReceived) {
        console.log('credentialRecord received', credentialRecord)
      }
    }
  )
}

function addProofHandler(agent: Agent) {
  agent.events.on(
    ProofEventTypes.ProofStateChanged,
    async (event: ProofStateChangedEvent) => {
      console.log('ProofStateChanged', event)
      const { proofRecord } = event.payload
      if (proofRecord.state === ProofState.RequestReceived) {
        console.log(`proofRecord ${proofRecord.state}`, proofRecord)
        console.log(`proofRecord accepting request`)
        const retrievedCredentials =
          await agent.proofs.getRequestedCredentialsForProofRequest(
            proofRecord.id,
            {
              filterByPresentationPreview: true,
            }
          )
        console.log('retrievedCredentials', retrievedCredentials)

        const requestedCredentials =
          agent.proofs.autoSelectCredentialsForProofRequest(
            retrievedCredentials
          )
        console.log('requestedCredentials', requestedCredentials)

        await agent.proofs.acceptRequest(proofRecord.id, requestedCredentials)
      }
      if (proofRecord.state === ProofState.Done) {
        console.log('proofRecord done', proofRecord)
      }
    }
  )
}

run()
