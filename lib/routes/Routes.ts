import * as express from 'express'
import { noCache } from '../middleware/NoCacheMiddleware'
import { validJWTNeeded, requiredRole } from '../middleware/AuthMiddleware'
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
// An example of re-using an existing endpoint function, but with different middleware (role access)
// Note that this will not be represented on the swagger because it's routed but not annotated
router.get(`${ServiceEndpoints.route}/ping-secure`, forbidExternalFrontends, noCache, [validJWTNeeded, requiredRole('public')], serviceController.getPing)

// Define Top Level. This requires verification of the provided user roles/grants with webade

export default router