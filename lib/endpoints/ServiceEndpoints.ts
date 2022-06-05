import * as os from 'os'

/**
 * This is a Service Endpoint provider
 * This class is used to define your endpoint business logic, and will often
 * be 1-1 mapping on the related Controller class.
 */
export class ServiceEndpoints {
  /**
   * A Simple Echo endpoint that echoes the passed in string on the path
   * @param text The supplied input to Echo
   * @returns Echo
   */
  public async getEcho (text: string) {
    return text
  }

  /**
   * A simple echo that returns the body
   * @param body
   * @returns 
   */
  public async echoBody (body: any) {
    return body
  }

  /**
   * A simple Ping message to determine if the API is available and receiving requests
   * @returns Pong
   */
  public async getPing (pongMessage: string) {
    return pongMessage
  }

  public async getHealth () {
    return {
      status: 'Running',
      memoryAvailable: Math.ceil(os.totalmem() / 1000000) - Math.ceil((os.totalmem() - os.freemem()) / 1000000),
      otherModles: 'Could be added here for a more robust health check'
    }
  }
}
