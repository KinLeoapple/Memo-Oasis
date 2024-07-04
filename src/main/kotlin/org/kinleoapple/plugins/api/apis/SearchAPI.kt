package org.kinleoapple.plugins.api.apis

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.dao.search.searchBlog

fun Application.searchApi(database: Database) {
    routing {
        get("/search/blog") {
            call.respond(searchBlog(database, call))
        }
    }
}