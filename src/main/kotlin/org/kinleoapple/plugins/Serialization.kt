package org.kinleoapple.plugins

import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.configureDatabase
import org.kinleoapple.database.dao.*


fun Application.configureSerialization() {
    val database = Database(configureDatabase())
    database.invoke()
    val content = environment.config.propertyOrNull("markdown.content")?.getString()

    install(ContentNegotiation) {
        gson {
        }
    }
    routing {
        get("/basic_info") {
            call.respond(getBasicInfo(database))
        }

        get("/blog/content/{id}") {
            call.respond(mapOf("content" to content))
        }

        get("/blog/draft/{id}") {
            val id = call.parameters["id"]
            if (id == "null")
                call.respond(getDraftAll(database))
            else
                id?.let {
                    call.respond(getDraft(database, it.toLong()))
                }
        }

        post("/blog/draft/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
            val json = call.receiveText()
            call.respond(postDraft(database, json, id))
        }

        post("/blog/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
            val json = call.receiveText()
            call.respond(postBlog(database, json, id))
        }

        get("/img/{id}") {
            val id = call.parameters["id"]
            if (id != "null") {
                id?.let {
                    call.respondBytes(getImg(database, it.toLong()))
                }
            }
        }

        post("/img/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
            val form = call.receiveMultipart()
            call.respond(postImg(database, form, id))
        }

        post("/login") {
            val json = call.receiveText()
            call.respond(getLogin(database, json))
        }
    }
}
