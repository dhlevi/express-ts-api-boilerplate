import { ValidateError } from '../model/ValidateError'
import { ServiceEndpoints } from '../endpoints/ServiceEndpoints'
import { Controller } from '../core/Controller'
import { Route, SuccessResponse, Response, Security, Get, Path, Query, NoCache, Cors } from '../core/Decorators'

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
 * so your business logic can focus on that. Obviously the examples here are so
 * simple that it seems a bit silly.
 */
@Route('api')
export class ServiceController extends Controller {
  /**
   * A Simple Echo endpoint that echoes the passed in string on the path
   * @param text The supplied input to Echo
   * @returns Echo
   */
  @Get('echo/{echo}')
  @SuccessResponse('200', 'OK')
  @Response<ValidateError>(422, "Validation Failed")
  @NoCache()
  @Cors({ origin: false })
  public async getEcho (@Path() echo: string, @Query() echoQuery: string) {
    const endpoints = new ServiceEndpoints()
    return endpoints.getEcho(echo)
  }

  /**
   * A simple Ping message to determine if the API is available and receiving requests
   * @returns Pong
   */
  @Get('ping')
  @SuccessResponse('200', 'OK')
  @NoCache()
  @Cors({ origin: false })
  public async getPing () {
    const endpoints = new ServiceEndpoints()  
    return endpoints.getPing()
  }

  @Get('healthCheck')
  @SuccessResponse('200', 'OK')
  @Security('BearerAuth')
  @NoCache()
  @Cors({ origin: false })
  public async getHealth () {
    const endpoints = new ServiceEndpoints()
    return endpoints.getHealth()
  }
}
