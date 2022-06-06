import { v4 as uuidv4 } from 'uuid'

export class Application {
  public applicationAcronym: string | null = null
  public custodianNumber: string | null = null
  public applicationName: string | null = null
  public applicationDescription: string | null = null
  public applicationObjectPrefix: string | null = null
  public enabled: string | null = null
  public applicationVersion: string | null = null
  public reportedWebadeVersion: string | null = null

  constructor (row: any) {
    this.applicationAcronym = row['APPLICATION_ACRONYM'] ? row['APPLICATION_ACRONYM'] : null
    this.custodianNumber = row['CUSTODIAN_NUMBER'] ? row['CUSTODIAN_NUMBER'] : null
    this.applicationName = row['APPLICATION_NAME'] ? row['APPLICATION_NAME'] : null
    this.applicationDescription = row['APPLICATION_DESCRIPTION'] ? row['APPLICATION_DESCRIPTION'] : null
    this.applicationObjectPrefix = row['APPLICATION_OBJECT_PREFIX'] ? row['APPLICATION_OBJECT_PREFIX'] : null
    this.enabled = row['ENABLED_IND'] ? row['ENABLED_IND'] : null
    this.applicationVersion = row['APPLICATION_VERSION'] ? row['APPLICATION_VERSION'] : null
    this.reportedWebadeVersion = row['REPORTED_WEBADE_VERSION'] ? row['REPORTED_WEBADE_VERSION'] : null
  }
}

export class Action {
  public actionName: string | null = null
  public privileged: string | null = null
  public roleName: string | null = null

  constructor (row: any) {
    this.actionName = row['ACTION_NAME'] ? row['ACTION_NAME'] : null
    this.roleName = row['ROLE_NAME'] ? row['ROLE_NAME'] : null
    this.privileged = row['PRIVILEGED_IND'] ? row['PRIVILEGED_IND'] : null
  }
}

export class Role {
  public roleName: string | null = null
  public roleDefinition: string | null = null
  public oracleRole: string | null = null

  constructor (row: any) {
    this.oracleRole = row['ORACLE_ROLE'] ? row['ORACLE_ROLE'] : null
    this.roleName = row['ROLE_NAME'] ? row['ROLE_NAME'] : null
    this.roleDefinition = row['ROLE_DEFINITION'] ? row['ROLE_DEFINITION'] : null
  }
}

export class Preference {
  public preferenceId: string | null = null
  public preferenceType: string | null = null
  public preferenceSubType: string | null = null
  public preferenceSetName: string | null = null
  public preferenceName: string | null = null
  public preferenceValue: string | null = null
  public preferenceDescription: string | null = null
  public preferenceDataType: string | null = null
  public sensitiveData: string | null = null

  constructor (row: any) {
    this.preferenceId = row['PREFERENCE_ID'] ? row['PREFERENCE_ID'] : null
    this.preferenceType = row['PREFERENCE_TYPE'] ? row['PREFERENCE_TYPE'] : null
    this.preferenceSubType = row['PREFERENCE_SUB_TYPE'] ? row['PREFERENCE_SUB_TYPE'] : null
    this.preferenceSetName = row['PREFERENCE_SET_NAME'] ? row['PREFERENCE_SET_NAME'] : null
    this.preferenceName = row['PREFERENCE_NAME'] ? row['PREFERENCE_NAME'] : null
    this.preferenceValue = row['PREFERENCE_VALUE'] ? row['PREFERENCE_VALUE'] : null
    this.preferenceDescription = row['PREFERENCE_DESCRIPTION'] ? row['PREFERENCE_DESCRIPTION'] : null
    this.preferenceDataType = row['PREFERENCE_DATA_TYPE_CODE'] ? row['PREFERENCE_DATA_TYPE_CODE'] : null
    this.sensitiveData = row['SENSITIVE_DATA_IND'] ? row['SENSITIVE_DATA_IND'] : null
  }
}

export class DatabaseProxy {
  public proxyId: string | null = null
  public roleName: string | null = null
  public dbUserId: string | null = null
  public dbPassword: string | null = null
  public dbDriver: string | null = null
  public connectionInfo: string | null = null
  public minConnections: string | null = null
  public maxConnections: string | null = null
  public maxConnectionIdleTime: string | null = null
  public maxConnectionWaitTime: string | null = null
  public monitorSleepTime: string | null = null
  public poolConnections: string | null = null
  public pingConnections: string | null = null

  constructor (row: any) {
    this.proxyId = uuidv4()
    this.roleName = row['ROLE_NAME'] ? row['ROLE_NAME'] : null
    this.dbUserId = row['DB_USERID'] ? row['DB_USERID'] : null
    this.dbPassword = row['DB_PASSWORD'] ? row['DB_PASSWORD'] : null
    this.connectionInfo = row['CONNECTION_INFO'] ? row['CONNECTION_INFO'] : null
    this.minConnections = row['MIN_CONNECTIONS'] ? row['MIN_CONNECTIONS'] : null
    this.maxConnections = row['MAX_CONNECTIONS'] ? row['MAX_CONNECTIONS'] : null
    this.maxConnectionIdleTime = row['MAX_CONNECTION_IDLE_TIME'] ? row['MAX_CONNECTION_IDLE_TIME'] : null
    this.maxConnectionWaitTime = row['MAX_CONNECTION_WAIT_TIME'] ? row['MAX_CONNECTION_WAIT_TIME'] : null
    this.monitorSleepTime = row['MONITOR_SLEEP_TIME'] ? row['MONITOR_SLEEP_TIME'] : null
    this.poolConnections = row['POOL_CONNECTIONS_IND'] ? row['POOL_CONNECTIONS_IND'] : null
    this.pingConnections = row['PING_CONNECTIONS_IND'] ? row['PING_CONNECTIONS_IND'] : null
  }
}
