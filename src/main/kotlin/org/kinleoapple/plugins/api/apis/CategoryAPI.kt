package org.kinleoapple.plugins.api.apis

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.dao.category.getCategory
import org.kinleoapple.plugins.sqlite.database.dao.category.getCategoryAll
import org.kinleoapple.plugins.sqlite.database.dao.category.getCategoryNumber
import org.kinleoapple.plugins.sqlite.database.dao.category.postCategory
import org.kinleoapple.util.security.verifyToken

fun Application.categoryAPI(database: Database) {
    routing {
        authenticate {
            post("/cat/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]?.toLongOrNull()
                    val json = call.receiveText()
                    call.respond(postCategory(database, json, id))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }
        }

        get("/cat/{id}") {
            val id = call.parameters["id"]
            if (id == "null")
                call.respond(getCategoryAll(database))
            else
                id?.let {
                    call.respond(getCategory(database, it.toLong()))
                }
        }

        get("/cat/number/{id}") {
            val id = call.parameters["id"]
            if (id == "null") {
                call.respond(getCategoryNumber(database, 0))
            } else {
                id?.let {
                    call.respond(getCategoryNumber(database, it.toLong()))
                }
            }
        }
    }
}