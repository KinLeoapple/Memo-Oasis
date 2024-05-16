package org.kinleoapple.security

import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.getLogin

fun verifyUser(database: Database, name: String, pass: String): Boolean {
    val userinfo =  """
            {
                "username": "$name",
                "password": "$pass"
            }
        """.trimIndent()

    return getLogin(database, userinfo)["login"] == true
}