package org.kinleoapple.plugins.database.dao

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.relation.User
import org.ktorm.dsl.*
import org.mindrot.jbcrypt.BCrypt

/**
 * Return a map of the login result.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @return A map of the login result.
 */
fun getLogin(database: Database, json: String): Map<String, Boolean> {
    data class DataClass(
        @SerializedName("username")
        val username: String,
        @SerializedName("password")
        val password: String
    )

    var pass: String? = null;

    val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

    val result = database.connection.from(User)
        .select(User.userPassword)
        .where(User.userName eq dataClass.username)
    result.forEach {
        pass = it[User.userPassword]
    }
    val checkpw = BCrypt.checkpw(pass, dataClass.password)

    return mapOf("login" to checkpw)
}