package org.kinleoapple.database.relation

import org.ktorm.schema.Table
import org.ktorm.schema.long
import org.ktorm.schema.varchar

private const val TABLE_NAME = "category"

data object Category : Table<Nothing>(TABLE_NAME) {
    val catId = long("cat_id").primaryKey()
    val catName = varchar("cat_name")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `$TABLE_NAME` (
        `cat_id` BIGINT NOT NULL,
        `cat_name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`cat_id`));
""".trimIndent()

fun createCategory(): String {
   return sql
}