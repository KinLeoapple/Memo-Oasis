package org.kinleoapple.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.blog.getBlog
import org.kinleoapple.database.dao.blog.getBlogAll
import org.kinleoapple.database.dao.blog.postBlog
import org.kinleoapple.database.dao.draft.getDraftAll
import org.kinleoapple.security.verifyToken

fun Application.blogAPI(database: Database) {
    val content = environment.config.propertyOrNull("markdown.content")?.getString()

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
        }

        get("/blog/{id}") {
            val id = call.parameters["id"]
            if (id == "null")
                call.respond(getBlogAll(database))
            else
                id?.let {
                    call.respond(getBlog(database, it.toLong()))
                }
        }

        get("/blog/content/{id}") {
            call.respond(mapOf("content" to content))
        }
    }
}