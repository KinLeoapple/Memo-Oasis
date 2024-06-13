package org.kinleoapple.database.relation

import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

private val TABLE_NAME by lazy { "role" }

data object Role: Table<Nothing>(TABLE_NAME) {
    val roleId = int("role_id").primaryKey()
    val roleName = varchar("role_name")
}

private val sql: String by lazy {
    """
    CREATE TABLE IF NOT EXISTS `$TABLE_NAME` (
      `role_id` INT NOT NULL DEFAULT 0,
      `role_name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`role_id`));
    CREATE UNIQUE INDEX IF NOT EXISTS `idx_$TABLE_NAME` ON `$TABLE_NAME` (role_id);
""".trimIndent()
}

fun createRole(): String {
    return sql
}