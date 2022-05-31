import oracledb = require("oracledb")
import { AppProperties } from "../AppProperties"

/**
 * Webade helper singleton class. Initialized on application startup.
 *
 * The webade singleton functions similar to the java implementation. On app
 * startup, it will initialize with the provided bootstrap and application
 * acronym.
 */
export class Webade {
  private static _instance: Webade
  private initialized = false
  private _application: any
  private _actions: Array<any> = []
  private _roles: Array<any> = []
  private _preferences: Array<any> = []
  private _proxies: Array<any> = []

  // Singleton pattern requires a private constructor to prevent instantiation
  private constructor () { /* empty */ }
  /**
   * The static method that controls the access to the webade singleton instance.
   */
  public static instance (): Webade {
      if (!Webade._instance) {
        Webade._instance = new Webade()
      }
      return Webade._instance
  }

  // Static initializers and functions
  public static async initialize (): Promise<void> {
    return Webade.instance().initialize()
  }

  public static application () {
    return Webade.instance().application()
  }

  public static actions () {
    return Webade.instance().actions()
  }

  public static roles () {
    return Webade.instance().roles()
  }

  public static preferences () {
    return Webade.instance().preferences()
  }

  public static proxies () {
    return Webade.instance().proxies()
  }

  public static getPreference (set: string, preference: string): string {
    return Webade.instance().preferences().find(p => p.PREFERENCE_SET.toLowerCase() === set.toLowerCase() && p.PREFERENCE_NAME.toLowerCase() === preference.toLowerCase())
  }

  public static getPreferenceValue (set: string, preference: string): string {
    return Webade.instance().preferences().find(p => p.PREFERENCE_SET.toLowerCase() === set.toLowerCase() && p.PREFERENCE_NAME.toLowerCase() === preference.toLowerCase()).PREFERENCE_VALUE
  }

  public static async fetchTokenJWT (token: string): Promise<string | null> {
    let jwtToken = null
    let connection
    try {
      oracledb.fetchAsString = [ oracledb.CLOB ];
      connection = await oracledb.getConnection({
        user: AppProperties.get('webade.bootstrap.user') as string,
        password: AppProperties.get('webade.bootstrap.password') as string,
        connectString: AppProperties.get('webade.bootstrap.connection') as string
      })

      const tokens = await connection.execute(`SELECT * from oauth_token_store WHERE token_guid = :token`, [token], { outFormat: oracledb.OUT_FORMAT_OBJECT })
      if (tokens && tokens.rows) {
        for (let row of tokens.rows) {
          console.log(`JWT token found for ${token}`)
          if ((row as any).EXPIRY_TIMESTAMP.getTime() > new Date().getTime()) {
            jwtToken = (row as any).TOKEN
          }
        }
      }
    } catch (ex) {
      console.error(`Failed to connect to webade: ${ex}`)
    } finally {
      if (connection) {
        connection.close()
      }
    }

    return jwtToken
  }

  // non-static functions
  private async initialize (): Promise<void> {
    // connect to the bootstrap DB
    // Because this is a one-off, we don't bother with oracledb.createPool
    // but with data access elsewhere, or via the proxies, we'll use pools
    let connection
    try {
      const acronym = AppProperties.get('webade.application') as string
      connection = await oracledb.getConnection({
        user: AppProperties.get('webade.bootstrap.user') as string,
        password: AppProperties.get('webade.bootstrap.password') as string,
        connectString: AppProperties.get('webade.bootstrap.connection') as string
      })

      this._application = null
      this._actions = []
      this._roles = []
      this._preferences = []
      this._proxies = []

      // Fetch application
      const application = await connection.execute(`SELECT * from application WHERE application_acronym = :acronym`, [acronym], { outFormat: oracledb.OUT_FORMAT_OBJECT })
      if (application && application.rows) {
        for (let row of application.rows) {
          console.log(`Webade Application ${acronym} found`)
          this._application = row
        }
        // Fetch Actions
        console.log('Fetching Actions...')
        const actions = await connection.execute(`SELECT a.action_name, a.privileged_ind, al.role_name FROM action a JOIN action_lnk al ON a.action_name = al.action_name WHERE a.application_acronym = :acronym`, [acronym], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (actions && actions.rows) {
          for (let row of actions.rows) {
            this._actions.push(row)
          }
        }
        // Fetch Roles
        console.log('Fetching Roles...')
        const roles = await connection.execute(`SELECT * FROM application_role WHERE application_acronym = :acronym`, [acronym], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (roles && roles.rows) {
          for (let row of roles.rows) {
            this._roles.push(row)
          }
        }
        // Fetch properties
        console.log('Fetching Preferences...')
        const preferences = await connection.execute(`SELECT * FROM preference WHERE application_acronym = :acronym`, [acronym], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (preferences && preferences.rows) {
          for (let row of preferences.rows) {
            this._preferences.push(row)
          }
        }
        // Fetch Proxies
        console.log('Fetching Proxy Connections...')
        const proxies = await connection.execute(`SELECT * FROM proxy_control WHERE application_acronym = :acronym`, [acronym], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (proxies && proxies.rows) {
          for (let row of proxies.rows) {
            this._proxies.push(row)
          }
        }

        this.initialized = true
      } else {
        console.error(`Failed to configure webade. Acronym '${acronym}' does not exist`)
      }
    } catch (ex) {
      console.error(`Failed to configure Webade Application: ${ex}`)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }

  public application () {
    return this._application
  }

  public actions () {
    return this._actions
  }

  public roles () {
    return this._roles
  }

  public preferences () {
    return this._preferences
  }

  public proxies () {
    return this._proxies
  }
}