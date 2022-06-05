import { Controller as TsoaController, HttpStatusCodeLiteral, HttpStatusCodeStringLiteral, OtherValidOpenApiHttpStatusCode } from 'tsoa'

export class Controller extends TsoaController {
}

// Decorator Overrides
export function Get (path: string): Function {
  function getDecorator(target: any, property: any, descriptor: any) {
    target[property + '_Route'] = '/' + path.replace('{', ':').replace('}', '')
    return descriptor
  }
  return getDecorator
}

export function Post (path: string): Function {
  function postDecorator(target: any, property: any, descriptor: any) {
    target[property + '_Route'] = '/' + path.replace('{', ':').replace('}', '')
    return descriptor
  }
  return postDecorator
}

export function Put (path: string): Function {
  function putDecorator(target: any, property: any, descriptor: any) {
    target[property + '_Route'] = '/' + path.replace('{', ':').replace('}', '')
    return descriptor
  }
  return putDecorator
}

export function Patch (path: string): Function {
  function patchDecorator(target: any, property: any, descriptor: any) {
    target[property + '_Route'] = '/' + path.replace('{', ':').replace('}', '')
    return descriptor
  }
  return patchDecorator
}

export function Delete (path: string): Function {
  function deleteDecorator(target: any, property: any, descriptor: any) {
    target[property + '_Route'] = '/' + path.replace('{', ':').replace('}', '')
    return descriptor
  }
  return deleteDecorator
}

export function Route (path: string): Function {
  function routeDecorator(target: any) {
    target.prototype['route'] = '/' + path
    return target
  }
  return routeDecorator
}

export function SuccessResponse (name: string | number, description?: string | undefined, produces?: string | string[] | undefined): Function {
  function responseDecorator(target: Controller, property: any, descriptor: any) {
    return descriptor
  }
  return responseDecorator
}

export function Response<ExampleType>(name: HttpStatusCodeLiteral | HttpStatusCodeStringLiteral | OtherValidOpenApiHttpStatusCode, description?: string, example?: ExampleType, produces?: string | string[]): Function {
  function responseDecorator(target: Controller, property: any, descriptor: any) {
    return descriptor
  }
  return responseDecorator
}

export function Security(name: string | { [name: string]: string[]; }, scopes?: string[] | undefined): Function {
  function securityDecorator(target: Controller, property: any, descriptor: any) {
    return descriptor
  }
  return securityDecorator
}

export function Path(name?: string | undefined): Function {
  function pathDecorator(target: Controller, property: any, argIndex: any) {
    return argIndex
  }
  return pathDecorator
}

export function Query(name?: string | undefined): Function {
  function queryDecorator(target: Controller, property: any, argIndex: any) {
    return argIndex
  }
  return queryDecorator
}