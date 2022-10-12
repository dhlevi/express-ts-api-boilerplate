import { HealthValidator } from "../core/model/HealthValidator";
import { WebadeCheck } from "./WebadeCheck";
/*
 * The Health Check loader is an array of validators that
 * you want run when the healthCheck endpoint is hit.
 * Obviously you can add additional health checks here
 * just instantiate a HealthValidator below `new WebadeCheck()`
 * and it'll be added to the health check.
 * Health check classes must extend the HealthValidator class
 * and do something in the validate function to be useful.
 * Check out the WebadeCheck as an example for making your own
 */

export const healthValidators: Array<HealthValidator> = [
  new WebadeCheck()
]