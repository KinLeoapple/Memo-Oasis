package org.kinleoapple.plugins.api.apis

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.dao.draft.*
import org.kinleoapple.util.security.verifyToken

fun Application.draftAPI(database: Database) {
    routing {
        authenticate {
            get("/blog/draft/content/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]
                    if (id == "null")
                        call.respond(getDraftContent(database, 0))
                    else
                        id?.let {
                            call.respond(getDraftContent(database, it.toLong()))
                        }
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }

            get("/blog/draft/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]
                    if (id == "null")
                        call.respond(getDraftAll(database))
                    else
                        id?.let {
                            call.respond(getDraft(database, it.toLong()))
                        }
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }

            post("/blog/draft/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]?.toLongOrNull()
                    val json = call.receiveText()
                    call.respond(postDraft(database, json, id))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }

            delete("/blog/draft") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val json = call.receiveText()
                    call.respond(deleteDraft(database, json))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }
        }
    }
}