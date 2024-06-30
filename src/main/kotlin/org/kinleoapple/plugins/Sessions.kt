package org.kinleoapple.plugins

import io.ktor.server.application.*
import io.ktor.server.sessions.*
import org.kinleoapple.dataclass.Session
import org.kinleoapple.util.generateSecretKey

fun Application.configureSessions() {
    install(Sessions) {
        val secretSignKey = generateSecretKey()
        cookie<Session>("session", SessionStorageMemory()) {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 60 * 60
            transform(SessionTransportTransformerMessageAuthentication(secretSignKey))
        }
    }
}