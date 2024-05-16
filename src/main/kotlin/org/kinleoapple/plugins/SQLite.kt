package org.kinleoapple.plugins

import io.ktor.server.application.*
import org.kinleoapple.database.relation.*

fun Application.configureSQLite() {
    createImage()
    createQuote()
    createUser()
    createCategory()
    createDraft()
    createBlog()
    createDesigner()
}