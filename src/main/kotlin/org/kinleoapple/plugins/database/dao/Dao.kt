package org.kinleoapple.plugins.database.dao

import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.relation.Designer
import org.kinleoapple.plugins.database.relation.User
import org.ktorm.dsl.*

/**
 * Return a map of some basic information, such as user's name.
 *
 * @param database The database which wish to search.
 * @return A map of basic information.
 */
fun getBasicInfo(database: Database): Map<String, String?> {
    var name: String? = null
    var designerName: String? = null
    var designerPage: String? = null;

    var result = database.connection.from(User)
        .select(User.userName)
        .where(User.userId eq 0)
    result.forEach {
        name = it[User.userName]
    }

    result = database.connection.from(Designer)
        .select(Designer.desiName)
        .where(Designer.desiId eq 0)
    result.forEach {
        designerName = it[Designer.desiName]
    }

    result = database.connection.from(Designer)
        .select(Designer.desiPage)
        .where(Designer.desiId eq 0)
    result.forEach {
        designerPage = it[Designer.desiPage]
    }

    return mapOf("name" to name, "desi_name" to designerName, "desi_page" to designerPage)
}