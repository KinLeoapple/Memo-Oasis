package org.kinleoapple.plugins

import io.ktor.server.application.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.configureDatabase
import org.kinleoapple.database.relation.*
import org.kinleoapple.database.util.createTable

fun Application.configureSQLite() {
    val sqlList: List<String> = listOf(
        createImage(),
        createQuote(),
        createUser(),
        createCategory(),
        createDraft(),
        createBlog(),
        createDesigner()
    )

    val database = Database(configureDatabase())
    sqlList.forEach { sql ->
        val conn = database.nativeConnect()
        createTable(sql, conn)
        conn?.close()
    }
}