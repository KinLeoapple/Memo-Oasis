package org.kinleoapple.plugins.database.dao

import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.relation.Draft
import org.ktorm.dsl.*
import java.io.File

/**
 * Return a map of the get draft result.
 *
 * @param database The database which wish to search.
 * @param id The id of the draft.
 * @return A map of the get draft result.
 */
fun getDraft(database: Database, id: Long): Map<String, String?> {
    var draftTitle: String? = null;
    var draftPath: String? = null;
    var draftContent: String? = null;
    var draftId: Long? = 0;

    val result = database.connection.from(Draft)
        .select(Draft.draftPath, Draft.draftTitle, Draft.draftPath)
        .where(Draft.draftId eq id)

    result.forEach {
        draftTitle = it[Draft.draftTitle]
        draftPath = it[Draft.draftPath]
        draftId = it[Draft.draftId]
    }

    val draftFile = File("$draftPath")
    draftContent = if (draftFile.exists())
        draftFile.readText()
    else
        ""

    return mapOf(
        "title" to draftTitle,
        "content" to draftContent,
        "id" to "$draftId",
    )
}