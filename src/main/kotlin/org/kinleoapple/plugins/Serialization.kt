package org.kinleoapple.plugins

import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.dao.getBasicInfo

fun Application.configureSerialization() {
    val database = Database(configureDatabase())

    install(ContentNegotiation) {
        gson {
        }
    }
    routing {
        get("/basic_info") {
            call.respond(getBasicInfo(database))
        }
    }
}
