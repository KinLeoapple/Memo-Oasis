package org.kinleoapple.plugins.database.relation

import io.ktor.server.application.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.util.md5
import org.ktorm.dsl.deleteAll
import org.ktorm.dsl.insert
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

private const val TABLE_NAME = "designer"

data object Designer: Table<Nothing>(TABLE_NAME) {
    val desiId = int("desi_id").primaryKey()
    val desiName = varchar("desi_name")
    val desiPage = varchar("desi_page")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `memo`.`${TABLE_NAME}` (
      `desi_id` INT NOT NULL DEFAULT 0,
      `desi_name` VARCHAR(30) NOT NULL,
      `desi_page` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`desi_id`));
""".trimIndent()

fun Application.createDesigner() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }

    val name = environment.config.propertyOrNull("memo.designer.name")?.getString() ?: "Memo"
    val page = environment.config.propertyOrNull("memo.designer.page")?.getString() ?: ""
    database.connection.deleteAll(Designer)
    database.connection.insert(Designer) {
        set(it.desiName, name)
        set(it.desiPage, page)
    }
}