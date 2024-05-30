package org.kinleoapple

import io.ktor.server.application.*
import io.ktor.server.netty.*
import org.kinleoapple.plugins.*


fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.module() {
    configureJWT()
    configureIdGenerator()
    configureSQLite()
    configureSerialization()
    configureHTTP()
    configureRouting()
    configureAPI()
}
