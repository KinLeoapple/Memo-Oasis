package org.kinleoapple.plugins.sqlite

import io.ktor.server.application.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.configureDatabase
import org.kinleoapple.plugins.sqlite.database.relation.*
import org.kinleoapple.plugins.sqlite.database.util.createTable

fun Application.configureSQLite() {
    val sqlList: List<String> by lazy {
        listOf(
            createImage(),
            createQuote(),
            createUser(),
            createCategory(),
            createDraft(),
            createBlog(),
            createDesigner()
        )
    }

    val database by lazy { Database(configureDatabase()) }
    sqlList.forEach { sql ->
        val conn = database.nativeConnect()
        createTable(sql, conn)
        conn?.close()
    }
}