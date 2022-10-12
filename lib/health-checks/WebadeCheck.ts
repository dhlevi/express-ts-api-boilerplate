import mybatisMapper = require('mybatis-mapper')
import oracledb = require('oracledb')
import path = require('path')
import { AppProperties } from '../core/AppProperties'
import { HealthStatus, HealthValidator } from '../core/model/HealthValidator'
import { Webade } from '../webade/Webade'

/**
 * An example Health Check Validator that will verify that the Webade system has been initialized
 * and the Webade database is available.
 */
export class WebadeCheck extends HealthValidator {
  constructor () {
    super()
    this.name = 'WebADE'
    this.description = 'WebADE Application Configuration Subsystem'
  }

  public async validate () {
    this.status = HealthStatus.GREEN
    this.message = 'WebADE is available'

    if (!Webade.initialized()) {
      this.status = HealthStatus.YELLOW
      this.message = 'Webade could not be initialized'
    }

    let connection = null
    try {
      connection = await oracledb.getConnection({
        user: AppProperties.get('webade.bootstrap.user') as string,
        password: AppProperties.get('webade.bootstrap.password') as string,
        connectString: AppProperties.get('webade.bootstrap.connection') as string
      })
      // load the queries from the query configs
      mybatisMapper.createMapper([path.resolve(__dirname, '../query-configs/webade-queries.xml')])
      let sql = mybatisMapper.getStatement('webade', 'application', { acronym : AppProperties.get('webade.application') as string }, {language: 'sql', indent: ' '})
      const application = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })
      if (application && application.rows && application.rows.length === 1) {
        // all good, don't change the status
      } else {
        this.status = HealthStatus.YELLOW
        this.message = 'Webade could not be initialized. The application acronym could not be found'
      }
    } catch (err) {
      this.status = HealthStatus.RED
      this.message = 'Failed to connect to the webade database: ' + err
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }
}