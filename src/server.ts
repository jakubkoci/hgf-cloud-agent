import express from 'express'
import {
  Agent,
  CredentialDefinitionTemplate,
  HttpOutboundTransport,
  V1CredentialPreview,
} from '@aries-framework/core'
import { HttpInboundTransport } from '@aries-framework/node'
import morgan from 'morgan'
import { asyncHandler, errorHandler } from './middleware'

async function startServer(
  agent: Agent,
  { port }: { port: number }
): Promise<void> {
  const app = express()
  app.use(morgan(':date[iso] :method :url :response-time'))
  app.set('json spaces', 2)

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
    '/connections',
    asyncHandler(async (req, res) => {
      const connectionRecords = await agent.connections.getAll()
      res.status(200).json(connectionRecords)
    })
  )

  app.get(
    '/issue-credential/:theirDid',
    asyncHandler(async (req, res) => {
      const theirDid = req.params.theirDid
      console.log(`Searching connection with theirDid ${theirDid}`)
      const connections = await agent.connections.getAll()
      const connection = connections.find((c) => c.theirDid === theirDid)
      if (!connection) {
        throw new Error(`Connection with theirDid ${theirDid} was not found.`)
      }
      const connectionId = connection?.id
      console.log(`Connection with ID ${connectionId} was found`)

      const credDefId = '9gFCquotxSS7ctKG1GJatU:3:CL:303:default'
      const credentialPreview = V1CredentialPreview.fromRecord({
        name: 'John',
        age: '99',
      })
      await agent.credentials.offerCredential({
        comment: 'some comment about credential',
        connectionId,
        credentialFormats: {
          indy: {
            attributes: credentialPreview.attributes,
            credentialDefinitionId: credDefId,
          },
        },
        protocolVersion: 'v1',
      })
      res.status(200).json({})
    })
  )

  app.get(
    '/accept-credential/:credentialId',
    asyncHandler(async (req, res) => {
      const credentialId = req.params.credentialId
      await agent.credentials.acceptRequest({
        credentialRecordId: credentialId,
        comment: 'V1 Indy Credential',
      })
      res.status(200).json({ credentialId })
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
      res.status(200).json({ schema })
    })
  )

  app.get(
    '/register-definition',
    asyncHandler(async (req, res) => {
      const schema = await agent.ledger.getSchema(
        '9gFCquotxSS7ctKG1GJatU:2:test-schema:1.0'
      )
      const definitionTemplate: CredentialDefinitionTemplate = {
        schema,
        signatureType: 'CL',
        supportRevocation: false,
        tag: 'default',
      }

      const definition = await agent.ledger.registerCredentialDefinition(
        definitionTemplate
      )
      res.status(200).json({ definition })
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
