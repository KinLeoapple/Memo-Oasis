package org.kinleoapple.security

import io.ktor.server.application.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.user.getUser
import java.util.*

fun verifyToken(database: Database, token: JWTPrincipal, call: ApplicationCall): Boolean {
    token.expiresAt?.let { date ->
        if (date.time <= Date().time) {
            return false
        } else {
            val name = token["name"]
            val ip = token["ip"]
            val ua = token["ua"]
            var userName: String? = null
            getUser(database).forEach {
                when (it.key) {
                    "name" -> userName = it.value
                    else -> return@forEach
                }
            }
            return call.request.origin.remoteHost == ip
                    && name == userName
                    && ua == call.request.headers["User-Agent"]
        }
    }
    return false
}