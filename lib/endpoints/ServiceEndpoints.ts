import { Get, Route, SuccessResponse, Path, Response } from 'tsoa'
import { ValidateError } from '../model/ValidateError'

const routePath = 'service'

/**
 * This is a Service Endpoint provider
 * This class is used to define your endpoint business logic, and will often
 * be 1-1 mapping on the related Controller class.
 */

@Route(routePath)
export class ServiceEndpoints {
  public static route = '/' + routePath
  /**
   * A Simple Echo endpoint that echoes the passed in string on the path
   * @param text The supplied input to Echo
   * @returns Echo
   */
  @Get('echo/{text}')
  @SuccessResponse('200', 'OK')
  @Response<ValidateError>(422, "Validation Failed")
  public async getEcho (@Path() text: string) {
    return text
  }

  /**
   * A simple Ping message to determine if the API is available and receiving requests
   * @returns Pong
   */
  @Get('ping')
  @SuccessResponse('200', 'OK')
  public async getPing () {
    return 'Pong'
  }
}
