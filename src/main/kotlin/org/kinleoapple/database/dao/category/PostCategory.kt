package org.kinleoapple.database.dao.category

import com.github.yitter.idgen.YitIdHelper
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Category
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update

/**
 * Return a map of the post category result which contains category id.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @param id The id of the category.
 * @return A map of the post category result.
 */
fun postCategory(database: Database, json: String, id: Long?): Map<String, String?> {
    try {
        data class DataClass(
            @SerializedName("catName")
            val catName: String,
        )

        val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

        if (dataClass.catName != "null" && dataClass.catName.trimIndent().isNotEmpty()) {
            val newId = id ?: YitIdHelper.nextId() // get id or generate id

            // store to database
            try {
                database.getConnection().insert(Category) {
                    set(it.catId, newId)
                    set(it.catName, dataClass.catName)
                }
            } catch (e: Exception) {
                e.message?.let {
                    if (it.contains("SQLITE_CONSTRAINT_UNIQUE"))
                        return mapOf("posted" to null)
                }
                database.getConnection().update(Category) {
                    set(it.catName, dataClass.catName)
                    where {
                        it.catId eq newId
                    }
                }
            }
            return mapOf("posted" to "$newId")
        } else
            return mapOf("posted" to null)
    } catch (e: Exception) {
        return mapOf("posted" to null)
    }
}