import * as express from 'express'
import { validJWTNeeded, requiredScopes } from '../middleware/AuthMiddleware'
import * as swaggerUi from "swagger-ui-express"
import { ServiceController } from '../controllers/ServiceController'

const router = express.Router();
// initialize your service endpoints
const serviceController = new ServiceController()
// Add/register your endpoints here.
// If you don't want the endpoint to cache, add the noCache middleware
// If you want the server to handle JWT auth, add the Auth Middleware
// [validation.validJWTNeeded, validation.requiredRole('public')]

// openAPI.
const swaggerDocument = require('../public/swagger.json');
router.use('/openapi', swaggerUi.serve);
router.get('/openapi', swaggerUi.setup(swaggerDocument));
// Service/Debug
router.get(`${(serviceController as any).route + (serviceController as any).getEcho_Route}`, ...serviceController.middleware, buildRouteHandler(serviceController.getEcho, 200))
router.get(`${(serviceController as any).route + (serviceController as any).getPing_Route}`, ...serviceController.middleware, buildRouteHandler(serviceController.getPing, 200))
router.get(`${(serviceController as any).route + (serviceController as any).getHealth_Route}`, ...serviceController.middleware, [validJWTNeeded, requiredScopes(['List', 'Of', 'Valid', 'Scopes'])], buildRouteHandler(serviceController.getHealth, 200))

/**
 * The buildRouteHander is a specialized function used to assist
 * with parsing your service constroller functions for auto-mapping
 * attributes to path, query and body params.
 */
function buildRouteHandler (func: any, status: number) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // Extract the function arguments
      const funcString = func.toString().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/(.)*/g, '').replace(/{[\s\S]*}/, '').replace(/=>/g, '').trim()
      const funcArgs = funcString.substring(funcString.indexOf("(") + 1, funcString.length - 1).split(", ")
      const args = []

      // Iterate over the args and determine if theres a
      // match in either the path params or the query string
      for (const arg of funcArgs) {
        const finalArg = arg.replace(/=[\s\S]*/g, '').trim()
        if (finalArg.length > 0) {
          if (req.params[finalArg]) {
            args.push(req.params[finalArg])
          } else if (req.query[finalArg]) {
            args.push(req.query[finalArg])
          } else {
            args.push(null)
          }
        }
      }

      const result = await func(...args, req.body)
      res.status(status).json(result)
    } catch (err) {
      console.error('Route Handler reported error from execution of ' + func.name + ': ' + err)
      next(err)
    }
  }
}

export default router