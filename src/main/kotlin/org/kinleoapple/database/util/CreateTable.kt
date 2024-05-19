package org.kinleoapple.database.util

import java.sql.Connection

fun createTable(sql: String, conn: Connection?) {
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }
}