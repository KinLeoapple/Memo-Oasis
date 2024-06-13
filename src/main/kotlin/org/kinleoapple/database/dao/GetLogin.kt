package org.kinleoapple.database.dao

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import org.kinleoapple.auth.Auth
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.User
import org.ktorm.dsl.*
import org.mindrot.jbcrypt.BCrypt

/**
 * Return a map of the login result.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @return A map of the login result.
 */
fun getLogin(database: Database, json: String, call: ApplicationCall, role: Int = 2): Map<String, String?> {
    data class DataClass(
        @SerializedName("username")
        val username: String,
        @SerializedName("password")
        val password: String
    )

    var pass: String? = null

    val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

    val result = database.getConnection().from(User)
        .select(User.userPassword)
        .where(User.userName eq dataClass.username)
    result.forEach {
        pass = it[User.userPassword]
    }
    val checkpw = BCrypt.checkpw(pass, dataClass.password)

    return when (checkpw) {
        true -> {
            val ua = call.request.headers["User-Agent"]
            ua?.let {
                val token = Auth.sign(dataClass.username, role, call.request.origin.remoteHost, it)
                return mapOf("login" to token)
            }
            mapOf("login" to null)
        }

        false -> mapOf("login" to null)
    }
}