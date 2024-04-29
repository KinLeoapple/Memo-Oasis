package org.kinleoapple

import io.ktor.server.application.*
import org.kinleoapple.plugins.configureHTTP
import org.kinleoapple.plugins.configureRouting
import org.kinleoapple.plugins.configureSerialization
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.relation.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    createQuote()
    createUser()
    createCategory()
    createBlog()
    createDesigner()

    configureDatabase()
    configureSerialization()
    configureHTTP()
    configureRouting()
}
