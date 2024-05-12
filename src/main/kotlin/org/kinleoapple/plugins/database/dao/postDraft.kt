package org.kinleoapple.plugins.database.dao

import com.github.yitter.idgen.YitIdHelper
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.relation.Draft
import org.ktorm.dsl.insert
import java.io.File
import java.time.LocalDateTime

/**
 * Return a map of the post draft result which contains draft id.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @param id The id of the draft.
 * @return A map of the post draft result.
 */
fun postDraft(database: Database, json: String, id: Long?): Map<String, String?> {
    try {
        data class DataClass(
            @SerializedName("title")
            val title: String,
            @SerializedName("draft")
            val draft: String,
        )

        val newId = id ?: YitIdHelper.nextId()
        val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)
        val saveTo = File("./draft/$newId")
        saveTo.parentFile.mkdirs()
        if (!saveTo.exists()) {
            saveTo.createNewFile()
        }
        saveTo.writeText(dataClass.draft)

        database.connection.insert(Draft) {
            set(it.draftId, newId)
            set(it.draftUpdateDt, LocalDateTime.now())
            set(it.draftPath, saveTo.path)
            set(it.draftTitle, dataClass.title)
        }
        return mapOf("saved" to "$newId")
    } catch (e: Exception) {
        return mapOf("saved" to null)
    }
}