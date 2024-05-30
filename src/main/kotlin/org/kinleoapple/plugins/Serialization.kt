package org.kinleoapple.plugins

import io.ktor.http.*
import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.configureDatabase
import org.kinleoapple.database.dao.blog.getBlog
import org.kinleoapple.database.dao.blog.postBlog
import org.kinleoapple.database.dao.category.getCategory
import org.kinleoapple.database.dao.category.getCategoryAll
import org.kinleoapple.database.dao.category.getCategoryNumber
import org.kinleoapple.database.dao.category.postCategory
import org.kinleoapple.database.dao.draft.getDraft
import org.kinleoapple.database.dao.draft.getDraftAll
import org.kinleoapple.database.dao.draft.getDraftContent
import org.kinleoapple.database.dao.draft.postDraft
import org.kinleoapple.database.dao.getBasicInfo
import org.kinleoapple.database.dao.getLogin
import org.kinleoapple.database.dao.img.getImg
import org.kinleoapple.database.dao.img.postImg
import org.kinleoapple.security.verifyToken


fun Application.configureSerialization() {
    val database = Database(configureDatabase())
    database.invoke()
    val content = environment.config.propertyOrNull("markdown.content")?.getString()

    install(ContentNegotiation) {
        gson {
        }
    }
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

            post("/blog/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]?.toLongOrNull()
                    val json = call.receiveText()
                    call.respond(postBlog(database, json, id))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }

            post("/img/{id}") {
                val token = call.authentication.principal<JWTPrincipal>()
                if (token?.let { verifyToken(database, it, call) } == true) {
                    val id = call.parameters["id"]?.toLongOrNull()
                    val form = call.receiveMultipart()
                    call.respond(postImg(database, form, id))
                } else
                    call.response.status(HttpStatusCode(401, "Invalid Token"))
            }

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

        get("/basic_info") {
            call.respond(getBasicInfo(database))
        }

        get("/blog/{id}") {
            val id = call.parameters["id"]
            if (id == "null")
                call.respond(getDraftAll(database))
            else
                id?.let {
                    call.respond(getBlog(database, it.toLong()))
                }
        }

        get("/blog/content/{id}") {
            call.respond(mapOf("content" to content))
        }

        get("/img/{id}") {
            val id = call.parameters["id"]
            if (id != "null") {
                id?.let {
                    call.respondBytes(getImg(database, it.toLong()))
                }
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

        post("/login") {
            val json = call.receiveText()
            call.respond(getLogin(database, json, call))
        }
    }
}
