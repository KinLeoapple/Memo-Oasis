package org.kinleoapple.database.dao.draft

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.ktorm.dsl.*
import java.io.File

fun getDraftContent(database: Database, id: Long): Map<String, String?> {
    when (id) {
        0L -> return mapOf("content" to null)
        else -> {
            var draftPath: String? = null;

            val result = database.getConnection().from(Draft)
                .select(Draft.draftPath)
                .where(Draft.draftId eq id)

            result.forEach {
                draftPath= it[Draft.draftPath]
            }

            val draftFile = File("$draftPath")
            val draftContent = if (draftFile.exists())
                draftFile.readText()
            else
                ""

            return mapOf("content" to draftContent)
        }
    }
}