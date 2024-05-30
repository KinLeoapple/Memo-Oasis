package org.kinleoapple.api

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.getBasicInfo
import org.kinleoapple.database.dao.getLogin

fun Application.api(database: Database) {
    routing {
        get("/basic_info") {
            call.respond(getBasicInfo(database))
        }

        post("/login") {
            val json = call.receiveText()
            call.respond(getLogin(database, json, call))
        }
    }
}