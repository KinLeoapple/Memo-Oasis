package org.kinleoapple.plugins

import io.ktor.server.application.*
import org.kinleoapple.api.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.configureDatabase

fun Application.configureAPI() {
    val database = Database(configureDatabase())
    database.invoke()

    api(database)
    blogAPI(database)
    categoryAPI(database)
    draftAPI(database)
    imgAPI(database)
}