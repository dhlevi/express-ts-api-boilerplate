import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

// A JWT secret. You do not want to hard-code this here, and should
// move it into a configuration or passed in environment variable.
// I didn't include an args lib in this boilerplate so feel free to
// choose whichever lib you like. Just please, for the love of all
// things holy, don't hard-code the secret here...
let secret = 'MyAppsSecret'

/**
 * Middleware that will prevent the request from executing if the request
 * header does not contain a valid and current JWT token, decoded by the
 * provided secret
 * @param _ The Request
 * @param res The Response
 * @param next The next function to execute
 * @returns 
 */
export function validJWTNeeded (_: Request, res: Response, next: NextFunction) {
  // Decode the token. If there is no provided header or the token
  // doesn't match the secret, this will be null, and the process
  // should return a 401
  const token = decodeToken(_)
  // If we have a token, verify it however you feel like verifying it
  if (token) {
    // check if the token has expired
    if ((token.payload as jwt.JwtPayload).stamp < new Date().getTime()) {
      return res.status(401).send()
    }
    // Verification is done and the token isn't expired, so move to the 
    // next function
    return next()
  } else {
    return res.status(401).send()
  }
}

export function requiredRole (role: string) {
  // Very weak role checking, but useful as an example
  // Determine the role on the token, and the role the endpoint
  // is requesting. If the user has the role, or they are "admin"
  // then we move on, otherwise we throw an error
  return (_: Request, res: Response, next: NextFunction) => {
    const token =  decodeToken(_)
    if (token) {
      let userPermissionLevel = (token.payload as jwt.JwtPayload).role
      if (userPermissionLevel === role || userPermissionLevel === 'admin') {
        // We have a token, and the user has the required role, move to the
        // next function. It's expected that we've already validated the token.
        return next()
      }
    }
    // If we dont have a token, or we do but the user isn't in the role return a 401
    return res.status(401).send()
  }
}

/**
 * Decoder for the token. If the token can be decoded
 * it will be returned to the caller
 * @param _ The request
 * @returns A JWT token, including Header, Payload and Signature, or NULL if the token is invalid
 */
function decodeToken (_: Request): jwt.Jwt | null {
  let token: jwt.Jwt | null = null
  // If we don't have an authorization header, we're done here
  if (_.headers['authorization']) {
    try {
      const authorization = _.headers['authorization'].split(' ')
      // If we have an auth header, but it's not a bearer token, we're done here
      if (authorization[0] === 'Bearer') {
        token = jwt.verify(authorization[1], secret, {complete: true})
      }
    } catch (err) {
      console.error(err)
      token = null
    }
  }

  return token
}
