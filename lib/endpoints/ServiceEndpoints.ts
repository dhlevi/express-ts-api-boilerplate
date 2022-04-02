import { NextFunction, Request, Response } from 'express'

/**
 * This is a Service Endpoint provider / Controller
 * This class is used to define your exportable functions that can in turn be bound
 * to the initialized Express server. You do not define Middleware or API endpoints
 * here, which allows for cleaner re-use or controller changing.
 *
 * This provided example is simple, with some exported public endpoint functions,
 * in practice these classes will likely be more complicated. As they get more complex
 * it's recommended to use this class as a provider only, and wire the functions into
 * detailed controllers, so the code doesn't get to cluttered with unrelated pieces.
 */
export class ServiceEndpoints {
  public getEcho = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const echo = req.params.echo
      res.status(200).json(echo)
    } catch (err) {
      next(err)
    }
  }

  public getPing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json('pong')
    } catch (err) {
      next(err)
    }
  }
}
