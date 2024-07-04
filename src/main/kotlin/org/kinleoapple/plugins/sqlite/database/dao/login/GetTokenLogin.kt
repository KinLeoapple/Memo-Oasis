package org.kinleoapple.plugins.sqlite.database.dao.login

import io.ktor.server.application.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.*
import org.kinleoapple.plugins.jwt.auth.Auth

/**
 * Return a map of the token login result.
 *
 * @param call The ApplicationCall.
 * @return A map of the token login result.
 */
fun getTokenLogin(token: JWTPrincipal,  call: ApplicationCall): Map<String, String?> {
    val ua = call.request.headers["User-Agent"]
    ua?.let {
        val username = token["name"]
        if (username != null) {
            val newToken = Auth.sign(username, call.request.origin.remoteHost, it)
            return mapOf("login" to newToken)
        } else
            return mapOf("login" to null)
    }
    return mapOf("login" to null)
}