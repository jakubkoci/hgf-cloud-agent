/* eslint-disable prefer-const */
import { createApp } from './app'
import { asyncHandler, errorHandler } from './middleware'

export async function startApp(): Promise<void> {
  // TODO 1. Initialize agent: agent config and instance

  const app = createApp()

  // TODO 1. Initialize agent: setup transports

  app.get(
    '/invitation',
    asyncHandler(async (req, res) => {
      // TODO 2. Make a connection
    })
  )

  app.get(
    '/register-definition',
    asyncHandler(async (req, res) => {
      // TODO 3. Register a credential definition
    })
  )

  app.get(
    '/issue-credential/:connectionId',
    asyncHandler(async (req, res) => {
      // TODO 4 Issue a credential
    })
  )

  app.get(
    '/request-proof/:connectionId',
    asyncHandler(async (req, res) => {
      // TODO 5. Request a proof
    })
  )

  app.use(errorHandler)
}
