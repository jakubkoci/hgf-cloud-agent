import express from 'express'
import { Agent } from '@aries-framework/core'
import morgan from 'morgan'
import cors from 'cors'
import { asyncHandler } from './middleware'
import { createSeed } from './util'
import * as repository from './repository'

export function createApp(agent: Agent) {
  const app = express()
  app.use(morgan(':date[iso] :method :url :response-time'))
  app.use(cors())
  app.use(express.json())
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
      res.status(200).json(agentDid || {})
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
        schemaId: repository.getSchemaId(),
        credentialDefinitionId: repository.getCredentialDefinitionId(),
      })
    })
  )

  app.get(
    '/register-schema',
    asyncHandler(async (req, res) => {
      const template = {
        attributes: [
          'Name',
          'Surname',
          'Date of Birth',
          'Event Name',
          'Event Year',
        ],
        name: 'Conference Ticket',
        version: '1.0',
      }
      const schema = await agent.ledger.registerSchema(template)
      repository.saveSchemaId(schema.id)
      res.status(200).json({ schema })
    })
  )

  app.get(
    '/create-did',
    asyncHandler(async (_, res) => {
      const didAndSeed = await createSeed(agent)
      res.status(200).json(didAndSeed)
    })
  )

  app.post(
    '/accept-invitation',
    asyncHandler(async (req, res) => {
      console.log('req.body', req.body)
      const { invitationUrl } = req.body
      const { outOfBandRecord, connectionRecord } =
        await agent.oob.receiveInvitationFromUrl(invitationUrl, {
          alias: 'Test name',
          autoAcceptInvitation: true,
          autoAcceptConnection: true,
        })
      res.status(200).json({ outOfBandRecord, connectionRecord })
    })
  )

  return app
}
