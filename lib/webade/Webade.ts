import { Application, Action, Role, Preference, DatabaseProxy } from './WebadeResources';
import mybatisMapper = require('mybatis-mapper')
import oracledb = require('oracledb')
import path = require('path')
import { v4 as uuidv4 } from 'uuid'
import { AppProperties } from '../core/AppProperties'

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
  private _application: Application | null = null
  private _actions: Array<Action> = []
  private _roles: Array<Role> = []
  private _preferences: Array<Preference> = []
  private _proxies: Array<DatabaseProxy> = []

  // Singleton pattern requires a private constructor to prevent instantiation
  private constructor () { /* empty */ }
  /**
   * The static method that controls the access to the webade singleton instance.
   */
  public static instance (): Webade {
      if (!Webade._instance) {
        Webade._instance = new Webade()
      }

      if (!Webade._instance.initialized) {
        console.warn('Webade currently uninitialized')
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

  public static getPreference (set: string, preference: string): Preference | undefined {
    return Webade.instance().preferences().find(p => p.preferenceSetName?.toLowerCase() === set.toLowerCase() && p.preferenceName?.toLowerCase() === preference.toLowerCase())
  }

  public static getPreferenceValue (set: string, preference: string): any {
    const pref = Webade.instance().preferences().find(p => p.preferenceSetName?.toLowerCase() === set.toLowerCase() && p.preferenceName?.toLowerCase() === preference.toLowerCase())
    return pref ? pref.preferenceValue : null
  }

  /**
   * You'd likely want to replace this approach over to use
   * the webade API checktoken
   * @param token The token
   * @returns 
   */
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

      // load the queries from the query configs
      mybatisMapper.createMapper([path.resolve(__dirname, '../query-configs/webade-queries.xml')])

      this._application = null
      this._actions = []
      this._roles = []
      this._preferences = []
      this._proxies = []

      // Fetch application
      let sql = mybatisMapper.getStatement('webade', 'application', { acronym : acronym }, {language: 'sql', indent: ' '})
      const application = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })
      if (application && application.rows) {
        for (let row of application.rows) {
          console.log(`Webade Application ${acronym} found`)
          this._application = new Application(row)
        }
        // Fetch Actions
        console.log('Fetching Actions...')
        sql = mybatisMapper.getStatement('webade', 'actions', { acronym : acronym }, {language: 'sql', indent: ' '})
        const actions = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (actions && actions.rows) {
          for (let row of actions.rows) {
            this._actions.push(new Action(row))
          }
        }
        // Fetch Roles
        console.log('Fetching Roles...')
        sql = mybatisMapper.getStatement('webade', 'roles', { acronym : acronym }, {language: 'sql', indent: ' '})
        const roles = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (roles && roles.rows) {
          for (let row of roles.rows) {
            this._roles.push(new Role(row))
          }
        }
        // Fetch properties
        console.log('Fetching Preferences...')
        sql = mybatisMapper.getStatement('webade', 'preferences', { acronym : acronym }, {language: 'sql', indent: ' '})
        const preferences = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (preferences && preferences.rows) {
          for (let row of preferences.rows) {
            this._preferences.push(new Preference(row))
          }
        }
        // Fetch Proxies
        console.log('Fetching Proxy Connections...')
        sql = mybatisMapper.getStatement('webade', 'proxies', { acronym : acronym }, {language: 'sql', indent: ' '})
        const proxies = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (proxies && proxies.rows) {
          for (let row of proxies.rows) {
            const proxy = new DatabaseProxy(row)
            this._proxies.push(proxy)
            // Create proxy pools
            if (proxy.poolConnections && proxy.proxyId && proxy.dbDriver?.toUpperCase() === 'ORACLE') {
              await oracledb.createPool({
                user: proxy.dbUserId || undefined,
                password: proxy.dbPassword || undefined,
                connectString: proxy.connectionInfo || undefined,
                poolAlias: proxy.proxyId
              })
            }
            // handle other types, postgres etc...
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