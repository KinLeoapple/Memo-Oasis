package org.kinleoapple.plugins.jwt

import io.ktor.server.application.*
import org.kinleoapple.plugins.jwt.auth.Auth
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