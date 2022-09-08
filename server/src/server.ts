import express from 'express'
import {
  Agent,
  AttributeFilter,
  AutoAcceptCredential,
  CredentialDefinitionTemplate,
  HttpOutboundTransport,
  PredicateType,
  ProofAttributeInfo,
  ProofPredicateInfo,
  V1CredentialPreview,
} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import morgan from 'morgan'
import cors from 'cors'
import { asyncHandler, errorHandler } from './middleware'
import { IndyWallet } from '@aries-framework/core/build/wallet/IndyWallet'
import { createSeed } from './util'

async function startServer(
  agent: Agent,
  { port }: { port: number }
): Promise<void> {
  const app = express()
  app.use(morgan(':date[iso] :method :url :response-time'))
  app.use(cors())
  app.set('json spaces', 2)

  let schemaId = process.env.SCHEMA_ID
  let credentialDefinitionId = ''

  app.get(
    '/',
    asyncHandler(async (req, res) => {
      res.send('Hello, World!')
    })
  )

  app.get(
    '/did',
    asyncHandler(async (req, res) => {
      const agentDid = agent.publicDid
      console.log('request to /did', agentDid)
      res.send(agentDid)
    })
  )

  // Create new invitation as inviter to invitee
  app.get(
    '/invitation',
    asyncHandler(async (req, res) => {
      const outOfBandRecord = await agent.oob.createInvitation()
      const { outOfBandInvitation } = outOfBandRecord
      res.send(outOfBandInvitation.toUrl({ domain: 'https://example.com/ssi' }))
    })
  )

  app.get(
    '/oobs',
    asyncHandler(async (req, res) => {
      const outOfBandRecords = await agent.oob.getAll()
      res.status(200).json(outOfBandRecords)
    })
  )

  app.get(
    '/connections',
    asyncHandler(async (req, res) => {
      const connectionRecords = await agent.connections.getAll()
      res.status(200).json(connectionRecords)
    })
  )

  app.get(
    '/credentials',
    asyncHandler(async (req, res) => {
      const credentialRecords = await agent.credentials.getAll()
      res.status(200).json(credentialRecords)
    })
  )

  app.get(
    '/issue-credential/:connectionId',
    asyncHandler(async (req, res) => {
      const connectionId = req.params.connectionId
      console.log('connectionId', connectionId)

      if (!credentialDefinitionId) {
        throw new Error('Credential definition is missing.')
      }

      const credentialPreview = V1CredentialPreview.fromRecord({
        name: 'John',
        age: '99',
      })
      const credentialExchangeRecord = await agent.credentials.offerCredential({
        comment: 'some comment about credential',
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
      const connectionId = req.params.connectionId

      if (!credentialDefinitionId) {
        throw new Error('Credential definition is missing.')
      }

      const attributes = {
        name: new ProofAttributeInfo({
          name: 'name',
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId,
            }),
          ],
        }),
      }

      // Sample predicates
      const predicates = {
        age: new ProofPredicateInfo({
          name: 'age',
          predicateType: PredicateType.GreaterThanOrEqualTo,
          predicateValue: 50,
          restrictions: [
            new AttributeFilter({
              credentialDefinitionId,
            }),
          ],
        }),
      }

      const proofRecord = await agent.proofs.requestProof(connectionId, {
        name: 'test-proof-request',
        requestedAttributes: attributes,
        requestedPredicates: predicates,
      })
      res.status(200).json({ proofRecord })
    })
  )

  app.get(
    '/proofs',
    asyncHandler(async (req, res) => {
      const proofRecords = await agent.proofs.getAll()
      res.status(200).json(proofRecords)
    })
  )

  app.get(
    '/schemas',
    asyncHandler(async (req, res) => {
      res.status(200).json({
        schemaId,
        credentialDefinitionId,
      })
    })
  )

  app.get(
    '/register-schema',
    asyncHandler(async (req, res) => {
      const template = {
        attributes: ['name', 'age'],
        name: `test-schema`,
        version: '1.0',
      }
      const schema = await agent.ledger.registerSchema(template)
      schemaId = schema.id
      res.status(200).json({ schema })
    })
  )

  app.get(
    '/register-definition',
    asyncHandler(async (req, res) => {
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
      credentialDefinitionId = definition.id
      res.status(200).json({ definition })
    })
  )

  app.get(
    '/create-did',
    asyncHandler(async (_, res) => {
      const didAndSeed = await createSeed(agent)
      res.status(200).json(didAndSeed)
    })
  )

  agent.registerInboundTransport(new HttpInboundTransport({ app, port }))
  agent.registerOutboundTransport(new HttpOutboundTransport())

  app.use(errorHandler)

  await agent.initialize()
}

async function stopServer(agent: Agent): Promise<void> {
  await agent.shutdown()
  await agent.wallet.delete()
}

export { startServer, stopServer }
