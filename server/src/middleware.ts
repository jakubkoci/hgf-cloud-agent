import { Request, Response, NextFunction } from 'express'

/**
 * @see https://zellwk.com/blog/async-await-express/
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

/**
 * @see https://zellwk.com/blog/async-await-express/
 *
 * @param next It must be defined for the function to be called as middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('Handling server error', error, error.message)
  res.status(500)
  res.json({ error: error.message || 'Unexpected error' })
}
