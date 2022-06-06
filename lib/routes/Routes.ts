import { RouteManager } from './../core/RouteManager';
import * as express from 'express'
import * as swaggerUi from "swagger-ui-express"
import { ServiceController } from '../controllers/ServiceController'
console.info(' ### Starting Controller Processing and Route Definition ### ')
const router = express.Router();

// Register any default endpoints here. For now, we just have an openAPI public route
// openAPI.
console.info('Adding /openapi top level endpoint for swagger documentation ...')
const swaggerDocument = require('../public/swagger.json');
router.use('/openapi', swaggerUi.serve);
router.get('/openapi', swaggerUi.setup(swaggerDocument));
// Next, if you want your routes built, you need to instantiate your Controllers, like so:
console.info('Initializing controllers...')
const serviceController = new ServiceController()
// Do the same for any other controllers you want routed
// from this point, the Decorators in your controller will automatically create a routing definition for you
// to get them initialized, use the RouteManager with your router:
RouteManager.initializeRoutes(router)
// And now your endpoints will be registered with instructions provided from your decorators.
// if you don't use decorators or need to do something custom, you can add additional routes
// as needed in the standard express js way
// router.<method>('route', ...middleware, function)

export default router
