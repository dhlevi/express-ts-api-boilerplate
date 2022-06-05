import { ValidateError } from '../model/ValidateError'
import { ServiceEndpoints } from '../endpoints/ServiceEndpoints'
import { Controller } from '../core/Controller'
import { Route, SuccessResponse, Response, Security, Get, Path, Query, NoCache, Cors, Body, Post } from '../core/Decorators'

/**
 * This is a Service Endpoint Controller
 * This class is used to define your exportable functions that can in turn be bound
 * to the initialized Express server.
 * Pay attention to the use of Decorators on the class, Without these, your endpoints will not be registered
 * and the class will do nothing. You also must instantiate the class on the router.
 *
 * The request and response objects are not exposed on this class, or subsequent classes
 * If you need to provide headers or manipulate the request or response in some way, you can use
 * middleware or supply a decorator for the purpose. Anything else will be ignored.
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
  public async getEcho (@Path() echo: string) {
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
  public async getPing (@Query('pong') pongMessage: string) {
    const endpoints = new ServiceEndpoints()  
    return endpoints.getPing(pongMessage)
  }

  @Post('echo-body')
  @SuccessResponse('201', 'Created')
  @NoCache()
  @Cors({ origin: false })
  public async echoBody (@Body() bodyObject: any) {
    const endpoints = new ServiceEndpoints()  
    return endpoints.echoBody(bodyObject)
  }

  @Get('healthCheck')
  @SuccessResponse('200', 'OK')
  @Security('BearerAuth', ['some', 'required', 'scopes'])
  @NoCache()
  @Cors({ origin: false })
  public async getHealth () {
    const endpoints = new ServiceEndpoints()
    return endpoints.getHealth()
  }
}
