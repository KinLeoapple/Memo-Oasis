package org.kinleoapple.database.dao.draft

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.ktorm.dsl.*
import java.time.ZoneOffset

/**
 * Return a map of the get draft result.
 *
 * @param database The database which wish to search.
 * @param id The id of the draft.
 * @return A map of the get draft result.
 */
fun getDraft(database: Database, id: Long): Map<String, String?> {
    var title: String? = null
    var date: String? = null

    val result = database.getConnection().from(Draft)
        .select(Draft.draftUpdateDt, Draft.draftTitle)
        .where(Draft.draftId eq id)

    result.forEach {
        title = it[Draft.draftTitle]
        date = it[Draft.draftUpdateDt]?.toInstant(ZoneOffset.UTC)?.toEpochMilli().toString()
    }

    return mapOf(
        "title" to title,
        "date" to date,
        "id" to "$id",
    )
}