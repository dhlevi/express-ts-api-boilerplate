import { NextFunction, Request, Response } from 'express'
import { Controller } from 'tsoa'
import { ServiceEndpoints } from '../endpoints/ServiceEndpoints'

/**
 * This is a Service Endpoint Controller
 * This class is used to define your exportable functions that can in turn be bound
 * to the initialized Express server. You do not define Middleware or API endpoints
 * here, which allows for cleaner re-use or controller changing.
 *
 * This provided example is simple, with some exported public endpoint functions,
 * in practice these classes will likely be more complicated.
 *
 * A key piece about Controllers: They don't implement the endpoint business logic.
 * That logic can be found in the related "Endpoint" class", in this case
 * ServiceEndpoints. The functions here are basically just wrappers around those
 * functions, to abstract away as much of the request/response and middleware stuff
 * so your business logic can focus on that.
 */
export class ServiceController extends Controller {
  public getRoute () {
    return ServiceEndpoints.route
  }

  public async getEcho (req: Request, res: Response, next: NextFunction) {
    try {
      const endpoints = new ServiceEndpoints()
      const echo = await endpoints.getEcho(req.params.echo)
      res.status(200).json(echo)
    } catch (err) {
      next(err)
    }
  }

  public async getPing (req: Request, res: Response, next: NextFunction) {
    try {
      const endpoints = new ServiceEndpoints()
      res.status(200).json(await endpoints.getPing())
    } catch (err) {
      next(err)
    }
  }
}
