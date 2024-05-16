package org.kinleoapple.database.relation

import io.ktor.server.application.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.configureDatabase
import org.ktorm.dsl.deleteAll
import org.ktorm.dsl.insert
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.long
import org.ktorm.schema.varchar

private const val TABLE_NAME = "quote"

data object Quote: Table<Nothing>(TABLE_NAME) {
    val quoteId = long("quote_id").primaryKey()
    val quoteText = varchar("quote_text")
    val quoteName = varchar("quote_name")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `$TABLE_NAME` (
      `quote_id` BIGINT NOT NULL DEFAULT 0,
      `quote_text` VARCHAR(500) NOT NULL,
      `quote_name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`quote_id`));
""".trimIndent()

fun Application.createQuote() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }

    val quote = environment.config.propertyOrNull("memo.user.quote")?.getString()
    val quoteName = environment.config.propertyOrNull("memo.user.quoteName")?.getString()
    database.connection.deleteAll(Quote)
    database.connection.insert(Quote) {
        set(Quote.quoteText, quote)
        set(Quote.quoteName, quoteName)
    }
}