package org.kinleoapple.plugins

import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.relation.Designer
import org.kinleoapple.plugins.database.relation.User
import org.ktorm.dsl.*

fun Application.configureSerialization() {
    val database = Database(configureDatabase())

    install(ContentNegotiation) {
        gson {
        }
    }
    routing {
        get("/user/name") {
            val result = database.connection.from(User)
                .select(User.userName)
                .where(User.userId eq 0)
            result.forEach {
                call.respond(mapOf("name" to it[User.userName]))
            }
        }
        get("/designer/name") {
            val result = database.connection.from(Designer)
                .select(Designer.desiName)
                .where(Designer.desiId eq 0)
            result.forEach {
                call.respond(mapOf("name" to it[Designer.desiName]))
            }
        }
        get("/designer/page") {
            val result = database.connection.from(Designer)
                .select(Designer.desiPage)
                .where(Designer.desiId eq 0)
            result.forEach {
                call.respond(mapOf("page" to it[Designer.desiPage]))
            }
        }
    }
}
