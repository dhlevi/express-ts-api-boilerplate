import { RouteManager } from './RouteManager';
import cors = require('cors')
import {HttpStatusCodeLiteral, HttpStatusCodeStringLiteral, OtherValidOpenApiHttpStatusCode } from 'tsoa'
import { requiredScopes, validJWTNeeded } from '../middleware/AuthMiddleware';
import { noCache } from '../middleware/NoCacheMiddleware';

/**
 * Apply NoCache middleware to an endpoint
 * @returns 
 */
export function NoCache (): Function {
  return function noCacheDecorator(target: any, property: any, descriptor: any) {
    RouteManager.registerEndpointMiddleware(target, property, noCache)
    return descriptor
  }
}

/**
 * Apply NoCache middleware to an endpoint
 * @returns 
 */
export function Cors (options?: cors.CorsOptions | cors.CorsOptionsDelegate<cors.CorsRequest> | undefined): Function {
  return function corsDecorator(target: any, property: any, descriptor: any) {
    RouteManager.registerEndpointMiddleware(target, property, cors(options))
    return descriptor
  }
}

/**
 * Indicator that this function handles a GET request, at the provided route
 * @param path The route to this request
 * @returns 
 */
export function Get (path: string): Function {
  return function getDecorator(target: any, property: any, descriptor: any) {
    const route = '/' + path.replace('{', ':').replace('}', '')
    RouteManager.registerEndpoint(target, property, route.replace('//', '/'), 'get')
    return descriptor
  }
}

/**
 * Indicator that this function handles a POST request, at the provided route
 * @param path The route to this request
 * @returns 
 */
export function Post (path: string): Function {
  return function postDecorator(target: any, property: any, descriptor: any) {
    const route = '/' + path.replace('{', ':').replace('}', '')
    RouteManager.registerEndpoint(target, property, route.replace('//', '/'), 'post')
    return descriptor
  }
}

/**
 * Indicator that this function handles a PUT request, at the provided route
 * @param path The route to this request
 * @returns 
 */
export function Put (path: string): Function {
  return function putDecorator(target: any, property: any, descriptor: any) {
    const route = '/' + path.replace('{', ':').replace('}', '')
    RouteManager.registerEndpoint(target, property, route.replace('//', '/'), 'put')
    return descriptor
  }
}

/**
 * Indicator that this function handles a PATCH request, at the provided route
 * @param path The route to this request
 * @returns 
 */
export function Patch (path: string): Function {
  return function patchDecorator(target: any, property: any, descriptor: any) {
    const route = '/' + path.replace('{', ':').replace('}', '')
    RouteManager.registerEndpoint(target, property, route.replace('//', '/'), 'patch')
    return descriptor
  }
}

/**
 * Indicator that this function handles a DEELTE request, at the provided route
 * @param path The route to this request
 * @returns 
 */
export function Delete (path: string): Function {
  return function deleteDecorator(target: any, property: any, descriptor: any) {
    const route = '/' + path.replace('{', ':').replace('}', '')
    RouteManager.registerEndpoint(target, property, route.replace('//', '/'), 'delete')
    return descriptor
  }
}

/**
 * Defines the base route at this controller from the application root
 * An empty path will indicate top level
 * @param path The route to this request
 * @returns 
 */
export function Route (path: string): Function {
  return function routeDecorator(target: any) {
    const route = '/' + path
    RouteManager.registerController(target, route.replace('//', '/'))
    return target
  }
}

/**
 * The expected success response
 * @param name Name or Number of the expected response code
 * @param description Description of the response
 * @param produces 
 * @returns 
 */
export function SuccessResponse (name: string | number, description?: string | undefined, produces?: string | string[] | undefined): Function {
  return function responseDecorator(target: any, property: any, descriptor: any) {
    RouteManager.registerEndpoint(target, property, null, null, name, description)
    return descriptor
  }
}

/**
 * Identify the expected response from this endpoint
 * @param name Name or Number of the expected response code
 * @param description Description of the response
 * @param example 
 * @param produces 
 * @returns 
 */
export function Response<ExampleType>(name: HttpStatusCodeLiteral | HttpStatusCodeStringLiteral | OtherValidOpenApiHttpStatusCode, description?: string, example?: ExampleType, produces?: string | string[]): Function {
  return function responseDecorator(target: any, property: any, descriptor: any) {
    return descriptor
  }
}

/**
 * Define the security params at this endpoint
 * @param name Type of security to implement
 * @param scopes Required Scopes
 * @returns 
 */
export function Security(name: string | { [name: string]: string[]; }, scopes?: string[] | undefined): Function {
  return function securityDecorator(target: any, property: any, descriptor: any) {
    if (name === 'BearerAuth') {
      const finalScopes = scopes ? scopes : []
      RouteManager.registerEndpointMiddleware(target, property, [validJWTNeeded, requiredScopes(finalScopes)])
    }
    // Other handler types for different authentication methods should be declared here. For now
    // I only care about supporting Bearer tokens/scopes with our webade implementation
    return descriptor
  }
}

/**
 * Declare this attributes source to be on the Path string. If the path string
 * parameter will be different then then argument name, you can provide a name to
 * map to
 * @param name 
 * @returns 
 */
export function Path(name?: string | undefined): Function {
  return function pathDecorator(target: any, property: any, argIndex: any) {
    RouteManager.registerArgument(target, property, name, argIndex, 'path')
    return argIndex
  }
}

/**
 * Declare this attributes source to be on the query string. If the query string
 * parameter will be different then then argument name, you can provide a name to
 * map to
 * @param name 
 * @returns 
 */
export function Query(name?: string | undefined): Function {
  return function queryDecorator(target: any, property: any, argIndex: any) {
    RouteManager.registerArgument(target, property, name, argIndex, 'query')
    return argIndex
  }
}

/**
 * Declare this attributes source to be on the Body. If the body
 * parameter will be different then then argument name, you can provide a name to
 * map to
 * @param name 
 * @returns 
 */
export function Body(name?: string | undefined): Function {
  return function bodyDecorator(target: any, property: any, argIndex: any) {
    RouteManager.registerArgument(target, property, name, argIndex, 'body')
    return argIndex
  }
}