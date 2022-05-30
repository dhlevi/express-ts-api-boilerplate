import { Webade } from './webade/Webade';
import { Application } from './Application'
import * as os from 'os'
import * as fs from 'fs'
import { AppProperties } from './AppProperties'

/**
 * Entrypoint for bootstrapping and starting the application.
 * This is a good spot to add in any needed telemtry, etc.
 */

// override console output with the ability
// to push to a log file
const logger = console as any
let writeToFile = AppProperties.get('log.path') !== null ? true : false

logger.screenLog = console.log
logger.screenInfo = console.info
logger.screenWarn = console.warn
logger.screenError = console.error

console.log = function (...args) {
  logHandler(['debug'], args, logger.screenLog)
}
console.info = function (...args) {
  logHandler(['debug', 'info'], args, logger.screenInfo)
}
console.warn = function (...args) {
  logHandler(['debug', 'info', 'warn'], args, logger.screenWarn)
}
console.error = function (...args) {
  logHandler(['debug', 'info', 'warn', 'error'], args, logger.screenError)
}
// End console log override

console.log('### INITIALIZING APPLICATION ###')

// initialize Webade. await?
Webade.initialize().then(() => {
  // set the port to start the server on.
  const port = AppProperties.get('port') ? AppProperties.get('port') as number : 1337
  // launch the application
  Application.createApplication(port).then(() => {
    console.info(`Current memory allocation: ${Math.ceil((os.totalmem() - os.freemem()) / 1000000)}mb of ${Math.ceil(os.totalmem() / 1000000)}mb`)
    console.info(`Running on: ${os.platform()} ${os.release()} ${os.arch()}`)
    console.info(`The application was started: http://localhost:${port}. Kill it using Ctrl + C`)
  })
})

/**
 * Handler for Logging override
 * @param levels Possible log leves
 * @param args Console args
 * @param out console output function
 */
function logHandler (levels: Array<string>, args: Array<any>, out: any) {
  if (levels.includes((AppProperties.get('log.level') as string).toLowerCase())) {
    out(...args)
    if (writeToFile) {
      try {
        const stream = fs.createWriteStream(AppProperties.get('log.path') as string, { flags: 'a+' })
        for (const arg of args) {
          stream.write(`${new Date().toUTCString()} - ${arg}\n`)
        }
        stream.end()
      } catch (err) {
        console.error('Failed to write to log file.')
        writeToFile = false
      }
    }
  }
}