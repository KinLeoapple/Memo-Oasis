package org.kinleoapple

import io.ktor.server.application.*
import io.ktor.server.netty.*
import org.kinleoapple.plugins.*
import org.kinleoapple.plugins.api.configureAPI
import org.kinleoapple.plugins.jwt.configureJWT
import org.kinleoapple.plugins.sqlite.configureSQLite


fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.module() {
    configureSessions()
    configureJWT()
    configureIdGenerator()
    configureSQLite()
    configureSerialization()
    configureHTTP()
    configureRouting()
    configureAPI()
    configureSwagger()
}
