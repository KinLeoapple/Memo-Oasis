package org.kinleoapple.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.img.getImg
import org.kinleoapple.database.dao.img.postImg
import org.kinleoapple.security.verifyToken

fun Application.imgAPI(database: Database) {
    routing {
        authenticate {
            post("/img/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]?.toLongOrNull()
                    val form = call.receiveMultipart()
                    call.respond(postImg(database, form, id))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }
        }

        get("/img/{id}") {
            val id = call.parameters["id"]
            if (id != "null") {
                id?.let {
                    call.respondBytes(getImg(database, it.toLong()))
                }
            }
        }
    }
}