import { Application } from './Application'

/**
 * Entrypoint for bootstrapping and starting the application.
 * This is a good spot to add in any needed telemtry, etc.
 */

// The port number the server will listen on. This should come from
// an environment config
// I didn't include an args lib in this boilerplate so feel free to
// choose whichever lib you like. Just please, for the love of all
// things holy, don't hard-code the port here...
const port = 1337
Application.createApplication(port).then(() => {
  console.info(`The application was started: http://localhost:${port}. Kill it using Ctrl + C`)
})
