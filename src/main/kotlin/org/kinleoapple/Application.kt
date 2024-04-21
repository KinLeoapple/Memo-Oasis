package org.kinleoapple

import io.ktor.server.application.*
import org.kinleoapple.plugins.configureHTTP
import org.kinleoapple.plugins.configureRouting
import org.kinleoapple.plugins.configureSerialization
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.relation.createBlog
import org.kinleoapple.plugins.database.relation.createCategory
import org.kinleoapple.plugins.database.relation.createDesigner
import org.kinleoapple.plugins.database.relation.createUser

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    createUser()
    createCategory()
    createBlog()
    createDesigner()

    configureDatabase()
    configureSerialization()
    configureHTTP()
    configureRouting()
}
