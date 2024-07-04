package org.kinleoapple.plugins.api.apis

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.dao.getBasicInfo
import org.kinleoapple.plugins.sqlite.database.dao.login.getLogin
import org.kinleoapple.plugins.sqlite.database.dao.login.getTokenLogin
import org.kinleoapple.util.security.verifyToken

fun Application.api(database: Database) {
    routing {
        authenticate {
            post("/login/token") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    call.respond(getTokenLogin(token, call))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }
        }

        get("/basic_info") {
            call.respond(getBasicInfo(database))
        }

        post("/login") {
            val json = call.receiveText()
            call.respond(getLogin(database, json, call))
        }
    }
}