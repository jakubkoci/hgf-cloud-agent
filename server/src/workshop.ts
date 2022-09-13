/* eslint-disable prefer-const */
import {
  Agent,
  AttributeFilter,
  AutoAcceptCredential,
  AutoAcceptProof,
  ConsoleLogger,
  CredentialDefinitionTemplate,
  HttpOutboundTransport,
  LogLevel,
  PredicateType,
  ProofAttributeInfo,
  ProofPredicateInfo,
  V1CredentialPreview,
} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import { createApp } from './app'
import { ledgers } from './ledgers'
import { asyncHandler, errorHandler } from './middleware'
import * as repository from './repository'

export async function startApp(): Promise<void> {
  // TODO Section 1: Agent Initialization (agent config and instance)

  const agent = new Agent(
    {
      label: process.env.AGENT_LABEL || '',
      logger: new ConsoleLogger(LogLevel.debug),
      walletConfig: {
        id: process.env.WALLET_NAME || '',
        key: process.env.WALLET_KEY || '',
      },
      endpoints: process.env.AGENT_ENDPOINTS?.split(','),
      autoAcceptConnections: true,
      publicDidSeed: process.env.PUBLIC_DID_SEED,
      indyLedgers: [ledgers.bcovrin_greenlight],
    },
    agentDependencies
  )

  const app = createApp(agent)

  agent.registerInboundTransport(
    new HttpInboundTransport({ app, port: Number(process.env.PORT) })
  )
  agent.registerOutboundTransport(new HttpOutboundTransport())

  app.use(errorHandler)

  await agent.initialize()

  app.get(
    '/invitation',
    asyncHandler(async (req, res) => {
      // TODO Section 2: Create an invitation
      const outOfBandRecord = await agent.oob.createInvitation()
      const { outOfBandInvitation } = outOfBandRecord
      res.send(outOfBandInvitation.toUrl({ domain: 'https://example.com/ssi' }))
    })
  )

  app.get(
    '/register-definition',
    asyncHandler(async (req, res) => {
      // TODO Section 3: Issue a credential (register a credential definition)
      const schemaId = repository.getSchemaId()
      if (!schemaId) throw new Error('Schema ID is missing.')
      const schema = await agent.ledger.getSchema(schemaId)
      const definitionTemplate: CredentialDefinitionTemplate = {
        schema,
        signatureType: 'CL',
        supportRevocation: false,
        tag: 'default',
      }

      const definition = await agent.ledger.registerCredentialDefinition(
        definitionTemplate
      )
      repository.saveCredentialDefinitionId(definition.id)
      res.status(200).json({ definition })
    })
  )

  app.get(
    '/issue-credential/:connectionId',
    asyncHandler(async (req, res) => {
      // TODO Section 3: Issue a credential
      const connectionId = req.params.connectionId
      console.log('connectionId', connectionId)

      const credentialDefinitionId = repository.getCredentialDefinitionId()
      if (!credentialDefinitionId) {
        throw new Error('Credential definition is missing.')
      }

      const credentialPreview = V1CredentialPreview.fromRecord({
        Name: 'John',
        Surname: 'Doe',
        'Date of Birth': '19911911',
        'Event Name': 'Hyperledger Global Forum',
        'Event Year': '2022',
      })
      const credentialExchangeRecord = await agent.credentials.offerCredential({
        comment:
          'This credentials allows the holder to enter the Hyperledger Global Forum conference.',
        connectionId,
        credentialFormats: {
          indy: {
            attributes: credentialPreview.attributes,
            credentialDefinitionId,
          },
        },
        protocolVersion: 'v1',
        autoAcceptCredential: AutoAcceptCredential.ContentApproved,
      })
      res.status(200).json({ credentialExchangeRecord })
    })
  )

  app.get(
    '/request-proof/:connectionId',
    asyncHandler(async (req, res) => {
      // TODO Section 4: Request a proof
      const connectionId = req.params.connectionId

      const credentialDefinitionId = repository.getCredentialDefinitionId()
      if (!credentialDefinitionId) {
        throw new Error('Credential definition is missing.')
      }

      const attributes = {
        Surname: new ProofAttributeInfo({
          name: 'Surname',
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId,
            }),
          ],
        }),
        'Event Name': new ProofAttributeInfo({
          name: 'Event Name',
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId,
            }),
          ],
        }),
      }

      const predicates = {
        'Date of Birth': new ProofPredicateInfo({
          name: 'Date of Birth',
          predicateType: PredicateType.LessThanOrEqualTo,
          predicateValue: 20000101,
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId,
            }),
          ],
        }),
        'Event Year': new ProofPredicateInfo({
          name: 'Event Year',
          predicateType: PredicateType.GreaterThanOrEqualTo,
          predicateValue: 2022,
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId,
            }),
          ],
        }),
      }

      const proofRecord = await agent.proofs.requestProof(
        connectionId,
        {
          name: 'Hyperledger Entrance Check',
          requestedAttributes: attributes,
          requestedPredicates: predicates,
        },
        {
          autoAcceptProof: AutoAcceptProof.ContentApproved,
        }
      )
      res.status(200).json({ proofRecord })
    })
  )

  app.use(errorHandler)
}
