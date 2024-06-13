package org.kinleoapple.security

import io.ktor.server.application.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.user.getUser
import org.kinleoapple.database.dao.user.getUserRole
import java.util.*

fun verifyToken(database: Database, token: JWTPrincipal, call: ApplicationCall): Boolean {
    token.expiresAt?.let { date ->
        if (date.time <= Date().time) {
            return false
        } else {
            val name = token["name"]
            val role = token["role"]
            val ip = token["ip"]
            val ua = token["ua"]
            var userName: String? = null
            var roleId: String? = null
            getUser(database, 0).forEach {
                when (it.key) {
                    "name" -> userName = it.value
                    else -> return@forEach
                }
            }
            getUserRole(database, 0).forEach {
                when (it.key) {
                    "id" -> roleId = it.value
                    else -> return@forEach
                }
            }
            return call.request.origin.remoteHost == ip
                    && name == userName
                    && role == roleId
                    && ua == call.request.headers["User-Agent"]
        }
    }
    return false
}