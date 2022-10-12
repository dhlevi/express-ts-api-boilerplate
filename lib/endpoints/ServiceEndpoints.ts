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
  public async getEcho (text: string): Promise<string> {
    return text
  }

  /**
   * A simple echo that returns the body
   * @param body
   * @returns 
   */
  public async echoBody (body: any): Promise<any> {
    return body
  }

  /**
   * A simple Ping message to determine if the API is available and receiving requests
   * @returns Pong
   */
  public async getPing (pongMessage: string): Promise<string> {
    return pongMessage
  }
}
