package org.kinleoapple.plugins.sqlite.database.dao.login

import cn.hutool.crypto.asymmetric.KeyType
import cn.hutool.crypto.asymmetric.RSA
import com.google.gson.Gson
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.sessions.*
import org.kinleoapple.plugins.jwt.auth.Auth
import org.kinleoapple.dataclass.LoginData
import org.kinleoapple.dataclass.SessionData
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.relation.User
import org.ktorm.dsl.*
import org.mindrot.jbcrypt.BCrypt

/**
 * Return a map of the login result.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @param call The ApplicationCall.
 * @return A map of the login result.
 */
fun getLogin(database: Database, json: String, call: ApplicationCall): Map<String, String?> {
    var pass: String? = null

    val dataClass: LoginData = Gson().fromJson(json, LoginData::class.java)

    var decryptPass: String? = null
    val sessionData = call.sessions.get<SessionData>()

    sessionData?.let {
        val privateKey = it.privateKey
        val publicKey = it.publicKey
        val rsa = RSA(privateKey, publicKey)
        decryptPass = rsa.decryptStr(dataClass.password, KeyType.PrivateKey);
    }
    val result = database.getConnection().from(User)
        .select(User.userPassword)
        .where(User.userName eq dataClass.username)
    result.forEach {
        pass = it[User.userPassword]
    }

    // if it can decrypt the password
    if (decryptPass != null) {
        val checkpw = BCrypt.checkpw(pass, decryptPass)

        return when (checkpw) {
            true -> {
                val ua = call.request.headers["User-Agent"]
                ua?.let {
                    val token = Auth.sign(dataClass.username, call.request.origin.remoteHost, it)
                    return mapOf("login" to token)
                }
                mapOf(
                    "login" to null,
                    "msg" to "Invalid user agent"
                )
            }

            false -> mapOf(
                "login" to null,
                "msg" to "Incorrect username or password"
            )
        }
    } else
        return mapOf(
            "login" to null,
            "msg" to "Error"
        )
}