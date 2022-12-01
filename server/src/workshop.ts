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

  const app = createApp()

  app.get(
    '/invitation',
    asyncHandler(async (req, res) => {
      // TODO Section 2: Create an invitation
    })
  )

  app.get(
    '/register-definition',
    asyncHandler(async (req, res) => {
      // TODO Section 3: Issue a credential (register a credential definition)
    })
  )

  app.get(
    '/issue-credential/:connectionId',
    asyncHandler(async (req, res) => {
      // TODO Section 3: Issue a credential
    })
  )

  app.get(
    '/request-proof/:connectionId',
    asyncHandler(async (req, res) => {
      // TODO Section 4: Request a proof
    })
  )

  app.use(errorHandler)
}
