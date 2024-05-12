package org.kinleoapple.plugins.database.relation

import io.ktor.server.application.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.ktorm.schema.*

private const val TABLE_NAME = "draft"

data object Draft: Table<Nothing>(TABLE_NAME) {
    val draftId = long("draft_id").primaryKey()
    val draftUpdateDt = datetime("draft_update_dt")
    val draftPath = varchar("draft_path")
    val draftTitle = varchar("draft_title")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `${TABLE_NAME}` (
          `draft_id` BIGINT NOT NULL,
          `draft_update_dt` DATETIME NOT NULL,
          `draft_path` VARCHAR(100) NOT NULL,
          `draft_title` VARCHAR(100) NOT NULL,
          PRIMARY KEY (`draft_id`));
""".trimIndent()

fun Application.createDraft() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }
}