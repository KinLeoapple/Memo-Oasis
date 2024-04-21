package org.kinleoapple.plugins.database

import com.alibaba.druid.pool.DruidDataSourceFactory
import org.ktorm.database.Database
import org.ktorm.logging.ConsoleLogger
import org.ktorm.support.mysql.MySqlDialect
import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.util.*
import javax.sql.DataSource

open class Database(private val config: DatabaseConfig) {
    var connection: Database
    private var dataSource: DataSource

    init {
        val prop = Properties()
        config.javaClass.declaredFields.forEach {
            prop[it.name] = "${it.apply { isAccessible = true }.get(config)}"
        }
        dataSource = DruidDataSourceFactory.createDataSource(prop)

        connection = Database.connect(
            dataSource = dataSource,
            dialect = MySqlDialect(),
            logger = ConsoleLogger(config.logLevel)
        )
    }

    fun nativeConnect() : Connection? {
        var conn: Connection? = null
        try {
            Class.forName(config.driverClassName)

            conn = DriverManager.getConnection(
                config.url,
                config.username, config.password
            )
        } catch (e: ClassNotFoundException) {
            e.printStackTrace()
        } catch (e: SQLException) {
            e.printStackTrace()
        }
        return conn
    }
}