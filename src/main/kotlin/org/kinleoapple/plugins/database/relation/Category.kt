package org.kinleoapple.plugins.database.relation

import io.ktor.server.application.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

private const val TABLE_NAME = "category"

data object Category : Table<Nothing>(TABLE_NAME) {
    val catId = int("cat_id").primaryKey()
    val catName = varchar("cat_name")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `${TABLE_NAME}` (
        `cat_id` INT NOT NULL,
        `cat_name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`cat_id`));
""".trimIndent()

fun Application.createCategory() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }
}