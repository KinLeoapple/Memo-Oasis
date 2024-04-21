package org.kinleoapple.plugins.database

import io.ktor.server.application.*
import org.ktorm.logging.LogLevel

data class DatabaseConfig(
    val driverClassName: String,    // 驱动的类名
    val url: String,                // jdbc url
    val username: String,           // 用户名
    val password: String,           // 密码
    val initialSize: Int = 10,      // 默认连接数
    val maxActive: Int = 25,        // 最大连接数
    val maxWait: Long = 3000,       // 最大等待时间
    val logLevel: LogLevel = LogLevel.DEBUG // 输出的日志级别
)

fun Application.configureDatabase(): DatabaseConfig {
    val url = environment.config.propertyOrNull("ktorm.mysql.url")?.getString() ?: "jdbc:mysql://localhost:3306/memo"
    val driver = environment.config.propertyOrNull("ktorm.mysql.driver")?.getString() ?: "com.mysql.cj.jdbc.Driver"
    val user = environment.config.propertyOrNull("ktorm.mysql.user")?.getString() ?: "root"
    val pass = environment.config.propertyOrNull("ktorm.mysql.password")?.getString() ?: "123456"

    val databaseConfig = DatabaseConfig(
        driverClassName = driver,
        url = url,
        username = user,
        password = pass
    )
    return databaseConfig
}
