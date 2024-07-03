package org.kinleoapple.database.dao.login

import cn.hutool.crypto.asymmetric.KeyType
import cn.hutool.crypto.asymmetric.RSA
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.sessions.*
import org.kinleoapple.auth.Auth
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.User
import org.kinleoapple.dataclass.SessionData
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
    data class DataClass(
        @SerializedName("username")
        val username: String,
        @SerializedName("password")
        val password: String
    )

    var pass: String? = null

    val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

    var decryptPass: String? = null
    val sessionData = call.sessions.get<SessionData>()

    sessionData?.let {
        val privateKey = it.privateKey
        val  publicKey = it.publicKey
        val rsa = RSA(privateKey, publicKey)
        decryptPass = rsa.decryptStr(dataClass.password, KeyType.PrivateKey);
    }
    val result = database.getConnection().from(User)
        .select(User.userPassword)
        .where(User.userName eq dataClass.username)
    result.forEach {
        pass = it[User.userPassword]
    }
    println(decryptPass)
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
                mapOf("login" to null)
            }

            false -> mapOf("login" to null)
        }
    } else
        return mapOf("login" to null)
}