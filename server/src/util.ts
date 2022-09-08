import { Agent } from '@aries-framework/core'
import { IndyWallet } from '@aries-framework/core/build/wallet/IndyWallet'
import { agentDependencies } from '@aries-framework/node'
import { randomBytes } from 'crypto'

export async function createSeed(agent: Agent) {
  const seed = randomBytes(16).toString('hex')
  const wallet = agent.dependencyManager.resolve(IndyWallet)
  const [did, verkey] = await agentDependencies.indy.createAndStoreMyDid(
    wallet.handle,
    {
      seed,
    }
  )

  return {
    seed,
    did,
    verkey,
  }
}
