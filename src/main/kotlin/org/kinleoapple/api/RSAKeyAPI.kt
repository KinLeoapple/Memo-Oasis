package org.kinleoapple.api

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.kinleoapple.dataclass.Session
import org.kinleoapple.util.generateKeyPair
import kotlin.random.Random

fun Application.rsaKeyAPI() {
    routing {
        get("/key") {
            val random = Random.nextLong()
            try {
                val keyPair = generateKeyPair()
                call.sessions.set(Session(id = random, publicKey = keyPair.first, privateKey = keyPair.second))
                call.respond(mapOf("key" to keyPair.first))
            } catch (e: Exception) {
                call.respond(mapOf("key" to null))
            }
        }
    }
}