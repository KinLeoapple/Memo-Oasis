package org.kinleoapple.database.dao

import com.github.yitter.idgen.YitIdHelper
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Draft
import org.kinleoapple.security.verifyUser
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update
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
            @SerializedName("name")
            val name: String,
            @SerializedName("hash")
            val hash: String,
            @SerializedName("title")
            val title: String,
            @SerializedName("draft")
            val draft: String,
        )

        val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

        // if login, save to file and store the information to database.
        if (verifyUser(database, dataClass.name, dataClass.hash)) {
            val newId = id ?: YitIdHelper.nextId() // get id or generate id
            // save to file
            val saveTo = File("./draft/$newId")
            saveTo.parentFile.mkdirs()
            if (!saveTo.exists()) {
                saveTo.createNewFile()
            }
            saveTo.writeText(dataClass.draft) // write to file

            // store to database
            try {
                database.connection.insert(Draft) {
                    set(it.draftId, newId)
                    set(it.draftUpdateDt, LocalDateTime.now())
                    set(it.draftPath, saveTo.path)
                    set(it.draftTitle, dataClass.title)
                }
            } catch (e: Exception) {
                database.connection.update(Draft) {
                    set(it.draftUpdateDt, LocalDateTime.now())
                    set(it.draftPath, saveTo.path)
                    set(it.draftTitle, dataClass.title)
                    where {
                        it.draftId eq newId
                    }
                }
            }
            return mapOf("saved" to "$newId")
        } else
            return mapOf("saved" to null)
    } catch (e: Exception) {
        return mapOf("saved" to null)
    }
}