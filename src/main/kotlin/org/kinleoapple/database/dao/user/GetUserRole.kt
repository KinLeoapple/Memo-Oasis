package org.kinleoapple.database.dao.user

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Role
import org.kinleoapple.database.relation.User
import org.ktorm.dsl.*

/**
 * Return a map of the user's role.
 *
 * @param database The database which wish to search.
 * @return A map of the user's role.
 */
fun getUserRole(database: Database, id: Long): Map<String, String?> {
    var roleId: Int? = null
    var roleName: String? = null

    var result = database.getConnection().from(User)
        .select(User.roleId)
        .where(User.userId eq id)
    result.forEach {
        roleId = it[User.roleId]
    }

    roleId?.let { i ->
        result = database.getConnection().from(Role)
            .select(Role.roleName)
            .where(Role.roleId eq i)
        result.forEach {
            roleName = it[Role.roleName]
        }
    }

    return mapOf(
        "id" to "$roleId",
        "name" to roleName
    )
}