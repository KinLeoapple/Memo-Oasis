package org.kinleoapple.database.relation

import io.ktor.server.application.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.configureDatabase
import org.kinleoapple.database.relation.Blog.primaryKey
import org.ktorm.schema.Table
import org.ktorm.schema.datetime
import org.ktorm.schema.long
import org.ktorm.schema.varchar

private const val TABLE_NAME = "img"

data object Image: Table<Nothing>(TABLE_NAME) {
    val imgId = long("img_id").primaryKey()
    val imgPubDt = datetime("img_pub_dt")
    val imgPath = varchar("img_path")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `$TABLE_NAME` (
        `img_id` BIGINT NOT NULL,
        `img_pub_dt` DATETIME NOT NULL,
        `img_path` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`img_id`));
""".trimIndent()

fun Application.createImage() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }
}