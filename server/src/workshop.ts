/* eslint-disable prefer-const */
import { createApp } from './app'
import { asyncHandler, errorHandler } from './middleware'

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
