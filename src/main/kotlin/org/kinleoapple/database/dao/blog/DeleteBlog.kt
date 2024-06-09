package org.kinleoapple.database.dao.blog

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Blog
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import java.io.File

/**
 * Return a map of the delete blog result.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @return A map of the delete blog result.
 */
fun deleteBlog(database: Database, json: String): Map<String, Boolean> {
    data class DataClass(
        @SerializedName("blog_id")
        val blogId: String,
    )

    val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

    // delete the information in database anyway.
    database.getConnection().delete(Blog) {
        it.blogId eq dataClass.blogId.toLong()
    }
    // try to delete file
    val blogFile = File("./blog/${dataClass.blogId}")
    blogFile.delete()
    return mapOf("deleted" to true)
}