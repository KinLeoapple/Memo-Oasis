package org.kinleoapple.plugins.api.apis

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.dao.blog.*
import org.kinleoapple.util.security.verifyToken

fun Application.blogAPI(database: Database) {
    routing {
        authenticate {
            post("/blog/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]?.toLongOrNull()
                    val json = call.receiveText()
                    call.respond(postBlog(database, json, id))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }

            delete("/blog") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val json = call.receiveText()
                    call.respond(deleteBlog(database, json))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }
        }

        get("/blog/total") {
            call.respond(getBolgTotal(database))
        }

        get("/blog/{id}") {
            val id = call.parameters["id"]
            if (id == "null") {
                call.respond(getBlogAll(database, call))
            }
            else
                id?.let {
                    call.respond(getBlog(database, it.toLong()))
                }
        }

        get("/blog/content/{id}") {
            val id = call.parameters["id"]
            if (id == "null")
                call.respond(getBlogContent(database, 0))
            else
                id?.let {
                    call.respond(getBlogContent(database, it.toLong()))
                }
        }
    }
}