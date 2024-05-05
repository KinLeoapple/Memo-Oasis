package org.kinleoapple.plugins

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.dao.getBasicInfo
import org.kinleoapple.plugins.database.dao.getLogin
import org.mindrot.jbcrypt.BCrypt


fun Application.configureSerialization() {
    val database = Database(configureDatabase())
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
            println(call.parameters["id"])
            call.respond(mapOf("content" to content))
        }

        post("/login") {
            val json = call.receiveText()
            call.respond(getLogin(database, json))
        }
    }
}
