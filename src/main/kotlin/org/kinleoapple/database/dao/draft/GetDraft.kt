package org.kinleoapple.database.dao.draft

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.ktorm.dsl.*

/**
 * Return a map of the get draft result.
 *
 * @param database The database which wish to search.
 * @param id The id of the draft.
 * @return A map of the get draft result.
 */
fun getDraft(database: Database, id: Long): Map<String, String?> {
    var draftTitle: String? = null;
    var draftId: Long? = 0;

    val result = database.getConnection().from(Draft)
        .select(Draft.draftId, Draft.draftPath, Draft.draftTitle)
        .where(Draft.draftId eq id)

    result.forEach {
        draftTitle = it[Draft.draftTitle]
        draftId = it[Draft.draftId]
    }

    return mapOf(
        "title" to draftTitle,
        "id" to "$draftId",
    )
}