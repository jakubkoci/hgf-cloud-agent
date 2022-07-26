import express from 'express'
import { Agent, HttpOutboundTransport } from '@aries-framework/core'
import { HttpInboundTransport } from '@aries-framework/node'

async function startServer(
  agent: Agent,
  { port }: { port: number }
): Promise<void> {
  const app = express()

  const httpInboundTransport = new HttpInboundTransport({
    app,
    port,
  })

  httpInboundTransport.app.set('json spaces', 2)

  httpInboundTransport.app.get('/', async (req, res) => {
    res.send('Hello, World!')
  })

  httpInboundTransport.app.get('/did', async (req, res) => {
    const agentDid = agent.publicDid
    console.log('request to /did', agentDid)
    res.send(agentDid)
  })

  // Create new invitation as inviter to invitee
  httpInboundTransport.app.get('/invitation', async (req, res) => {
    try {
      const { outOfBandInvitation } = await agent.oob.createInvitation()
      res.send(outOfBandInvitation.toUrl({ domain: 'https://example.com/ssi' }))
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message)
      } else {
        res.status(500).send('Unrecognized error!')
      }
    }
  })

  agent.registerInboundTransport(httpInboundTransport)
  agent.registerOutboundTransport(new HttpOutboundTransport())

  await agent.initialize()
}

async function stopServer(agent: Agent): Promise<void> {
  await agent.shutdown()
  await agent.wallet.delete()
}

export { startServer, stopServer }
