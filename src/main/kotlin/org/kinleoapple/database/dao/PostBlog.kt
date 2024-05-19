package org.kinleoapple.database.dao

import com.github.yitter.idgen.YitIdHelper
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Blog
import org.kinleoapple.security.verifyUser
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update
import java.io.File
import java.time.LocalDateTime

/**
 * Return a map of the post draft result which contains blog id.
 *
 * @param database The database which wish to search.
 * @param json The json containers the information.
 * @param id The id of the blog.
 * @return A map of the post blog result.
 */
fun postBlog(database: Database, json: String, id: Long?): Map<String, String?> {
    try {
        data class DataClass(
            @SerializedName("name")
            val name: String,
            @SerializedName("hash")
            val hash: String,
            @SerializedName("title")
            val title: String,
            @SerializedName("blog")
            val blog: String,
            @SerializedName("cat_id")
            val catId: String,
            @SerializedName("blog_des")
            val blogDes: String,
        )

        val dataClass: DataClass = Gson().fromJson(json, DataClass::class.java)

        // if login, save to file and store the information to database.
        if (verifyUser(database, dataClass.name, dataClass.hash)) {
            val newId = id ?: YitIdHelper.nextId() // get id or generate id
            // save to file
            val saveTo = File("./blog/$newId")
            saveTo.parentFile.mkdirs()
            if (!saveTo.exists()) {
                saveTo.createNewFile()
            }
            saveTo.writeText(dataClass.blog) // write to file

            // store to database
            try {
                database.connection.insert(Blog) {
                    set(it.blogId, newId)
                    set(it.catId, dataClass.catId.toLong())
                    set(it.blogPubDt, LocalDateTime.now())
                    set(it.blogPath, saveTo.path)
                    set(it.blogTitle, dataClass.title)
                    set(it.blogDes, dataClass.blogDes)
                }
            } catch (e: Exception) {
                database.connection.update(Blog) {
                    set(it.catId, dataClass.catId.toLong())
                    set(it.blogPubDt, LocalDateTime.now())
                    set(it.blogPath, saveTo.path)
                    set(it.blogTitle, dataClass.title)
                    set(it.blogDes, dataClass.blogDes)
                    where {
                        it.blogId eq newId
                    }
                }
            }

            // try to delete draft of this blog
            val draftId = """
                {
                    "username": "${dataClass.name}",
                    "password": "${dataClass.hash}"
                    "draft_id": $newId
                }
            """.trimIndent()
            deleteDraft(database, draftId)

            return mapOf("saved" to "$newId")
        } else
            return mapOf("saved" to null)
    } catch (e: Exception) {
        return mapOf("saved" to null)
    }
}