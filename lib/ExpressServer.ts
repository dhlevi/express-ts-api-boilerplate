import * as express from 'express'
import { Express } from 'express'
import { Server } from 'http'
import { noCache } from './middleware/NoCacheMiddleware'
import { validJWTNeeded, requiredRole } from './middleware/AuthMiddleware'
import * as compress from 'compression'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as cors from 'cors'
import { ServiceEndpoints } from './endpoints/ServiceEndpoints'

/**
 * Abstraction around the raw Express.js server and Nodes' HTTP server.
 * Defines HTTP request mappings, basic as well as request-mapping-specific
 * middleware chains for application logic, config and everything else.
 */

export class ExpressServer {
  // Server
  private server?: Express
  private httpServer?: Server
  // endpoint providers
  // As you add additional endpoint providers/controllers, you
  // can add them here for registration
  private serviceEndpoints: ServiceEndpoints

  constructor () {
    // Instantiate your endpoint providers here
    this.serviceEndpoints = new ServiceEndpoints()
  }

  /**
   * Initialize the Express Server. This will create the server
   * and apply default middleware, then create the listener.
   * @param port The port to listen on
   * @returns A promise to return the initialized Express Server
   */
  public async setup (port: number): Promise<Express> {
    const server = express()
    this.setupSecurityMiddlewares(server)
    this.setupStandardMiddlewares(server)
    this.configureApiEndpoints(server)
    this.httpServer = this.listen(server, port)
    this.server = server

    return this.server
  }

  /**
   * Establish the listener
   * @param server The express server to listen with
   * @param port The port to listen on
   * @returns The Server that will be listening for events
   */
  public listen (server: Express, port: number): Server {
    return server.listen(port)
  }

  /**
   * Terminate the listener
   */
  public kill () {
    if (this.httpServer) this.httpServer.close()
  }

  /**
   * Standard default middleware setup. Currently only
   * for Bodyparser and compress
   * @param server The express server
   */
  private setupStandardMiddlewares (server: Express) {
    server.use(bodyParser.json())
    server.use(compress())
  }

  /**
   * Standard default middleware for security (helmut)
   * @param server The express server
   */
  private setupSecurityMiddlewares (server: Express) {
    server.use(helmet())
    server.use(helmet.referrerPolicy({ policy: 'same-origin' }))
    server.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'unsafe-inline'"],
        scriptSrc: ["'unsafe-inline'", "'self'"]
      }
    }))

    server.disable('x-powered-by');
    server.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,responseType');
      res.setHeader('Access-Control-Expose-Headers', 'x-total-count,x-pending-comment-count,x-next-comment-id');
      res.setHeader('Cache-Control', 'max-age=4');
      next();
    });
  }

  /**
   * Initialize the servers endpoints. This function will allow you to map
   * your endpoint providers functions to a server endpoint. This can easily
   * be broken up if needed
   * @param server The express server
   */
  private configureApiEndpoints (server: Express) {
    // Toggle for cors handling.
    const forbidExternalFrontends = cors({ origin: false })
    // Add/register your endpoints here.
    // If you don't want the endpoint to cache, add the noCache middleware
    // If you want the server to handle JWT auth, add the Auth Middleware
    // [validation.validJWTNeeded, validation.requiredRole('public')]
    // Service/Debug
    server.get('/api/echo/:echo', forbidExternalFrontends, noCache, this.serviceEndpoints.getEcho)
    server.get('/api/ping', forbidExternalFrontends, noCache, this.serviceEndpoints.getPing)
    // An example of re-using an existing endpoint function, but with different middleware (role access)
    server.get('/api/ping-secure', forbidExternalFrontends, noCache, [validJWTNeeded, requiredRole('public')], this.serviceEndpoints.getPing)
  }
}
