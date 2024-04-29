package org.kinleoapple.plugins.database.relation

import io.ktor.server.application.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.relation.Quote.primaryKey
import org.kinleoapple.util.md5
import org.ktorm.dsl.deleteAll
import org.ktorm.dsl.insert
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

private const val TABLE_NAME = "user"

data object User : Table<Nothing>(TABLE_NAME) {
    val userId = int("user_id").primaryKey()
    val quoteId = int("quote_id")
    val userName = varchar("user_name")
    val userPassword = varchar("user_password")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `${TABLE_NAME}` (
        `user_id` INT NOT NULL DEFAULT 0, 
        `quote_id` INT NOT NULL DEFAULT 0,
        `user_name` VARCHAR(30) NOT NULL,
        `user_password` VARCHAR(40) NOT NULL,
    PRIMARY KEY (`user_id`)
    FOREIGN KEY (`quote_id`) REFERENCES `quote` (`quote_id`));
""".trimIndent()

fun Application.createUser() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }

    val name = environment.config.propertyOrNull("memo.user.name")?.getString() ?: "Memo"
    val password = environment.config.propertyOrNull("memo.user.password")?.getString() ?: "1234567890"
    database.connection.deleteAll(User)
    database.connection.insert(User) {
        set(it.userName, name)
        set(it.userPassword, md5(password))
    }
}
