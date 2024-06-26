package org.kinleoapple.database.dao.draft

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import java.io.File

/**
 * Return a map of the delete draft result.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @return A map of the delete draft result.
 */
fun deleteDraft(database: Database, json: String): Map<String, Boolean> {
    data class DataClass(
        @SerializedName("draft_id")
        val draftId: String,
    )

    val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

    // delete the information in database anyway.
    database.getConnection().delete(Draft) {
        it.draftId eq dataClass.draftId.toLong()
    }
    // try to delete file
    val draftFile = File("./draft/${dataClass.draftId}")
    draftFile.delete()
    return mapOf("deleted" to true)
}