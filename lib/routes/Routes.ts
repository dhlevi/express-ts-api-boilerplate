import * as express from 'express'
import { noCache } from '../middleware/NoCacheMiddleware'
import { validJWTNeeded, requiredScopes } from '../middleware/AuthMiddleware'
import * as cors from 'cors'
import * as swaggerUi from "swagger-ui-express"
import { ServiceController } from '../controllers/ServiceController'
import { ServiceEndpoints } from '../endpoints/ServiceEndpoints'

const router = express.Router();
// Toggle for cors handling.
const forbidExternalFrontends = cors({ origin: false })
// initialize your service endpoints
const serviceController = new ServiceController()
// Add/register your endpoints here.
// If you don't want the endpoint to cache, add the noCache middleware
// If you want the server to handle JWT auth, add the Auth Middleware
// [validation.validJWTNeeded, validation.requiredRole('public')]

// openAPI
const swaggerDocument = require('../public/swagger.json');
router.use('/openapi', swaggerUi.serve);
router.get('/openapi', swaggerUi.setup(swaggerDocument));
// Service/Debug
router.get(`${ServiceEndpoints.route}/echo/:echo`, forbidExternalFrontends, noCache, serviceController.getEcho)
router.get(`${ServiceEndpoints.route}/ping`, forbidExternalFrontends, noCache, serviceController.getPing)
router.get(`${ServiceEndpoints.route}/healthCheck`, forbidExternalFrontends, noCache, [validJWTNeeded, requiredScopes(['List', 'Of', 'Valid', 'Scopes'])], serviceController.getHealth)

export default router