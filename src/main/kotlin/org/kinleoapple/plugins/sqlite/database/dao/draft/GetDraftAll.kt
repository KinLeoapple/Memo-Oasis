package org.kinleoapple.plugins.sqlite.database.dao.draft

import io.ktor.server.application.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.relation.Draft
import org.kinleoapple.util.requestOffset
import org.kinleoapple.util.requestSize
import org.ktorm.dsl.*

/**
 * Return a map of the all draft result.
 *
 * @param database The database which wish to search.
 * @param userId The ID of the user.
 * @param call The ApplicationCall.
 * @return A map of the all draft result.
 */
fun getDraftAll(database: Database, userId: Long, call: ApplicationCall): Map<String, Map<String, String?>> {
    val offset = requestOffset(call)
    val size = requestSize(call)

    val map: MutableMap<String, Map<String, String?>> = HashMap()

    val result = database.getConnection().from(Draft)
        .select(Draft.draftId, Draft.draftUpdateDt)
        .where { Draft.userId eq userId }
        .limit(offset, size)
        .orderBy(Draft.draftUpdateDt.asc())

    result.forEach {
        val draftId: Long? = it[Draft.draftId];

        val draft = mapOf(
            "id" to "$draftId",
        )
        map["$draftId"] = draft
    }
    return map.toMap()
}