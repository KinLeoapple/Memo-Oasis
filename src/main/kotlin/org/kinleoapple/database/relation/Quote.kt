package org.kinleoapple.database.relation

import org.ktorm.schema.Table
import org.ktorm.schema.long
import org.ktorm.schema.varchar

private const val TABLE_NAME = "quote"

data object Quote : Table<Nothing>(TABLE_NAME) {
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
    CREATE UNIQUE INDEX IF NOT EXISTS `idx_$TABLE_NAME` ON `$TABLE_NAME` (quote_id);
""".trimIndent()

fun createQuote(): String {
    return sql
}