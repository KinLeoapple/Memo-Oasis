package org.kinleoapple.plugins.api

import io.ktor.server.application.*
import org.kinleoapple.plugins.api.apis.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.configureDatabase

fun Application.configureAPI() {
    val database = Database(configureDatabase())
    database.invoke()

    api(database)
    blogAPI(database)
    categoryAPI(database)
    draftAPI(database)
    imgAPI(database)
    searchApi(database)
    rsaKeyAPI()
}