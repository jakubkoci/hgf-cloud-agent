import { agentDependencies } from '@aries-framework/node'
import { Agent, InitConfig } from '@aries-framework/core'

function createAgent(agentConfig: InitConfig): Agent {
  return new Agent(agentConfig, agentDependencies)
}

export { createAgent }
