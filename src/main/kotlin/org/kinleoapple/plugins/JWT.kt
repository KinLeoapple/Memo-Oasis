package org.kinleoapple.plugins

import io.ktor.server.application.*
import org.kinleoapple.auth.Auth
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*

fun Application.configureJWT() {
    val verifier = Auth.makeJwtVerifier()

    install(Authentication) {
        jwt {
            verifier(verifier)
            validate {
                JWTPrincipal(it.payload)
            }
        }
    }
}