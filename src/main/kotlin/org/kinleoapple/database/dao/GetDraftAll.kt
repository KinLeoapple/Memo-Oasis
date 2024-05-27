package org.kinleoapple.database.dao

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.ktorm.dsl.forEach
import org.ktorm.dsl.from
import org.ktorm.dsl.select
import java.io.File

/**
 * Return a map of the all draft result.
 *
 * @param database The database which wish to search.
 * @return A map of the all draft result.
 */
fun getDraftAll(database: Database): Map<String, Map<String, String?>> {
    val map: MutableMap<String, Map<String, String?>> = HashMap()

    val result = database.getConnection().from(Draft)
        .select(Draft.draftId, Draft.draftTitle, Draft.draftPath, Draft.draftPath)

    result.forEach {
        val draftTitle: String? = it[Draft.draftTitle];
        val draftPath: String? = it[Draft.draftPath];
        val draftContent: String?;
        val draftId: Long? = it[Draft.draftId];

        val draftFile = File("$draftPath")
        draftContent = if (draftFile.exists())
            draftFile.readText()
        else
            ""

        val draft = mapOf(
            "title" to draftTitle,
            "content" to draftContent,
            "id" to "$draftId",
        )
        map["$draftId"] = draft
    }
    return map.toMap()
}