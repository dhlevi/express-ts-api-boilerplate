import { Pool, QueryResult } from 'pg'

export class PostgresDatabase {
  private static _instance: PostgresDatabase
  private _initialized = false
  private pool: Pool | null = null

  private constructor () { /* empty */ }

  private static instance (): PostgresDatabase {
      if (!PostgresDatabase._instance) {
        PostgresDatabase._instance = new PostgresDatabase()
      }

      if (!PostgresDatabase._instance._initialized) {
        console.warn('Database currently uninitialized')
      }

      return PostgresDatabase._instance
  }

  public static connection (): Pool | null {
    return PostgresDatabase.instance().pool
  }

  public static async shutdown (): Promise<void> {
    return PostgresDatabase.instance().pool?.end()
  }

  public static async query (query: string): Promise<QueryResult<any> | undefined> {
    if (this.initialized() && PostgresDatabase.instance().pool !== null) {
      console.log('Executing query: ', query)
      const result = await PostgresDatabase.instance().pool?.query(query)
      return result
    }
  }

  // Static initializers and functions
  public static async initialize (): Promise<void> {
    return PostgresDatabase.instance().initialize()
  }

  public static initialized (): boolean {
    return PostgresDatabase.instance()._initialized
  }

  private initialize () {
    console.log('Initializing Database...')

    // You'll note that this is creating a new pool, which will look for connection
    // parameters on your environment variables for the following configs:
    // PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE
    // You can override settings here by passing in whatever values you want into the pool,
    // just remember to create configs in your application.properties file and map them
    // here with the AppProperties component.
    this.pool = new Pool()

    this._initialized = true
    console.log('Initialized')
  }
}