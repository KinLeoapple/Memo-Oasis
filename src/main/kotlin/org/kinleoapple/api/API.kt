package org.kinleoapple.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.getBasicInfo
import org.kinleoapple.database.dao.login.getLogin
import org.kinleoapple.database.dao.login.getTokenLogin
import org.kinleoapple.dataclass.Session
import org.kinleoapple.security.verifyToken

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