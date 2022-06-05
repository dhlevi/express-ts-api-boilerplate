import { Router } from "express"
import * as express from 'express'

/**
 * The RouteManager is a Singleton control for the creation and registration of API Routes
 * This should only be called via applying Decorators to your Controller classes. As you add
 * Decorators to your class, functions and function arguments, the Route Definitions will be
 * created and updated. Once your controllers are instantiated the routes will be generated
 * and applied to the server.
 */
export class RouteManager {
  private static _instance: RouteManager
  private controllers: Map<string, RouteDefintion> = new Map<string, RouteDefintion>()


  // Singleton pattern requires a private constructor to prevent instantiation
  private constructor () { /* empty */ }
  /**
   * The static method that controls the access to the Properties singleton instance.
   */
  public static instance (): RouteManager {
      if (!RouteManager._instance) {
        RouteManager._instance = new RouteManager()
      }
      return RouteManager._instance
  }

  public static initializeRoutes (router: Router): boolean {
    return RouteManager.instance().initializeRoutes(router)
  }

  public static registerController (target: any, route: string | null = null): boolean {
    return RouteManager.instance().registerController(target, route)
  }

  public static registerEndpoint (target: any, property: string, route: string | null = null, type: string | null = null, success: number | string | null = null, successDescription: string | null = null): boolean {
    const regController = RouteManager.instance().registerController(target)
    const regEndpoint = RouteManager.instance().registerEndpoint(target, property, route, type, success, successDescription)
    return regController && regEndpoint
  }

  public static registerEndpointMiddleware(target: any, property: string, middleware: any) {
    const regController = RouteManager.instance().registerController(target)
    const regEndpoint = RouteManager.instance().registerEndpoint(target, property)
    const regMiddleware = RouteManager.instance().registerMiddleware(target, property, middleware)
    return regController && regEndpoint && regMiddleware
  }

  public static registerArgument (target: any, property: string, requestProperty: string | undefined, argIndex: number, type: string): boolean {
    const regController = RouteManager.instance().registerController(target)
    const regEndpoint = RouteManager.instance().registerEndpoint(target, property)
    const regArgument = RouteManager.instance().registerArgument(target, property, requestProperty, argIndex, type)
    return regController && regEndpoint && regArgument
  }

  public initializeRoutes (router: Router): boolean {
    try {
      // iterate the controllers and create a route on the router for each one
      for (const [key, value] of this.controllers.entries()) {
        console.log('Building routes for controller: ' + key)
        const controller = value as RouteDefintion
        for (const endpoint of controller.endpoints) {
          const route = controller.route + endpoint.route
          console.log(`Creating ${endpoint.type.toUpperCase()} route for ${endpoint.name} @ ${endpoint.route}`)
          if (endpoint.type === 'get') {
            router.get(route, ...endpoint.middleware, buildRouteHandler(endpoint.endpointFunc, endpoint.success, endpoint.parameters))
          }
        }
      }
    } catch (err) {
      console.error(err)
      return false
    }
    return true
  }

  public registerController (target: any, route: string | null = null): boolean {
    try {
      // find the declared controller or add a new one if it doesn't exist
      let controllerDef = this.controllers.get(target.constructor.name)
      if (!controllerDef) {
        controllerDef = new RouteDefintion()
        controllerDef.name = target.constructor.name
        controllerDef.controller = target
        this.controllers.set(target.constructor.name, controllerDef)
      }
      // set the route, if it's supplied
      if (route) {
        controllerDef.route = route
      }
    } catch (err) {
      console.error(err)
      return false
    }
    return true
  }

  public registerEndpoint (target: any, property: string, route: string | null = null, type: string | null = null, success: number | string | null = null, successDescription: string | null = null): boolean {
    try {
      // find the declared controller or add a new one if it doesn't exist
      const controllerDef = this.controllers.get(target.constructor.name)
      if (controllerDef) {
        let endpoint = controllerDef.endpoints.find(e => e.name === property)
        if (!endpoint) {
          endpoint = new EndpointDefinition()
          endpoint.name = property
          endpoint.endpointFunc = target[property]
          controllerDef.endpoints.push(endpoint)
        }
        // define route and type, if supplied
        if (route && type) {
          endpoint.type = type
          endpoint.route = route
        }

        if (success) {
          endpoint.success = success
        }

        if (successDescription) {
          endpoint.successDescription = successDescription
        }
      } else {
        throw new Error(`Controller ${target.constructor.name} has no defined handler`)
      }
    } catch (err) {
      console.error(err)
      return false
    }
    return true
  }

  public registerMiddleware (target: any, property: string, middleware: any): boolean {
    try {
      // find the declared controller or add a new one if it doesn't exist
      const controllerDef = this.controllers.get(target.constructor.name)
      if (controllerDef) {
        const endpoint = controllerDef.endpoints.find(e => e.name === property)
        if (!endpoint) {
          throw new Error(`Endpoint ${property} has no definition handler`)
        }
        // register middleware on the endpoint
        endpoint.middleware.push(middleware)
      } else {
        throw new Error(`Controller ${target.constructor.name} has no defined handler`)
      }
    } catch (err) {
      console.error(err)
      return false
    }
    return true
  }

  public registerArgument (target: any, property: string, requestProperty: string | undefined, argIndex: number, type: string): boolean {
    try {
      // find the declared controller or add a new one if it doesn't exist
      const controllerDef = this.controllers.get(target.constructor.name)
      if (controllerDef) {
        const endpoint = controllerDef.endpoints.find(e => e.name === property)
        if (endpoint) {
          if (endpoint.parameters.find(p => p.index === argIndex)) {
            throw new Error('A duplicate parameter index has been defined. Parameter ignored.')
          }

          const param = new ParameterDefinition()
          param.type = type
          param.index = argIndex

          // extract the function argument from the target so we can determine the correct name
          const func = target[property]
          const funcString = func.toString().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/(.)*/g, '').replace(/{[\s\S]*}/, '').replace(/=>/g, '').trim()
          const funcArgs = funcString.substring(funcString.indexOf("(") + 1, funcString.length - 1).split(", ")

          param.name = funcArgs[argIndex]
          param.argName = requestProperty || param.name // if no override name is provided, assume the param name and argument are the same

          endpoint.parameters.push(param)
        } else {
          throw new Error(`Endpoint ${property} has no defined handler`)
        }
      } else {
        throw new Error(`Controller ${target.constructor.name} has no defined handler`)
      }
    } catch (err) {
      console.error(err)
      return false
    }
    return true
  }
}

/*
 * Route definition model for Primary controller, endpoint, and arguments
 */

export class RouteDefintion {
  public name: string = ''
  public controller: any = null
  public route: string = ''
  public endpoints: Array<EndpointDefinition> = []
}

export class EndpointDefinition {
  public name: string = ''
  public endpointFunc: Function | null = null
  public route: string = ''
  public type: string = ''
  public parameters: Array<ParameterDefinition> = []
  public middleware: Array<any> = []
  public success: number | string = 200
  public successDescription: string = 'OK'
}

export class ParameterDefinition {
  public name: string = ''
  public argName: string = ''
  public type: string = ''
  public index: number = -1
}

/**
 * The buildRouteHander is a specialized function used to assist
 * with parsing your service constroller functions for auto-mapping
 * attributes to path, query and body params.
 */
function buildRouteHandler (func: any, status: number | string, parameters: Array<ParameterDefinition>) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // Extract the function arguments
      // const funcString = func.toString().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/(.)*/g, '').replace(/{[\s\S]*}/, '').replace(/=>/g, '').trim()
      // const funcArgs = funcString.substring(funcString.indexOf("(") + 1, funcString.length - 1).split(", ")
      // Probably not needed, unless we wanted to verify the name of the argument

      // Create an args array of the same length as our function parameters
      // and pre-fill them with undefined values
      const args = Array.from(Array(parameters.length))
      // iterate over our parameter list for this endpoint and 
      // apply values as needed
      for (const param of parameters) {
        if (param.type === 'path' && req.params[param.argName]) {
          args[param.index] = req.params[param.argName]
        } else if (param.type === 'query' && req.query[param.argName]) {
          args[param.index] = req.query[param.argName]
        } else if (param.type === 'body') {
          args[param.index] = req.body()
        }
      }

      // handle the endpoint function with the defined arguments
      const result = await func(...args)

      // return the status and resulting json message
      const finalStatus = typeof status === 'string' ? parseInt(status) : status
      res.status(finalStatus).json(result)
    } catch (err) {
      console.error('Route Handler reported error from execution of ' + func.name + ': ' + err)
      next(err)
    }
  }
}