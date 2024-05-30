package org.kinleoapple.database.dao.draft

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.ktorm.dsl.forEach
import org.ktorm.dsl.from
import org.ktorm.dsl.select

/**
 * Return a map of the all draft result.
 *
 * @param database The database which wish to search.
 * @return A map of the all draft result.
 */
fun getDraftAll(database: Database): Map<String, Map<String, String?>> {
    val map: MutableMap<String, Map<String, String?>> = HashMap()

    val result = database.getConnection().from(Draft)
        .select(Draft.draftId)

    result.forEach {
        val draftId: Long? = it[Draft.draftId];

        val draft = mapOf(
            "id" to "$draftId",
        )
        map["$draftId"] = draft
    }
    return map.toMap()
}