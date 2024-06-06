package org.kinleoapple.database.dao.blog

import org.kinleoapple.database.Database
import org.kinleoapple.database.dao.category.getCategory
import org.kinleoapple.database.relation.Blog
import org.ktorm.dsl.*
import java.time.ZoneOffset

/**
 * Return a map of the blog information.
 *
 * @param database The database which wish to search.
 * @param id The id of the blog.
 * @return A map of the blog information.
 */
fun getBlog(database: Database, id: Long): Map<String, String?> {
    var title: String? = null
    var desc: String? = null
    var date: String? = null
    var catId: Long? = null
    var category: String? = null

    val result = database.getConnection().from(Blog)
        .select(Blog.blogTitle, Blog.blogDes, Blog.blogPubDt, Blog.catId)
        .where(Blog.blogId eq id)

    result.forEach {
        title = it[Blog.blogTitle]
        desc = it[Blog.blogDes]
        date = it[Blog.blogPubDt]?.toInstant(ZoneOffset.UTC)?.toEpochMilli().toString()
        catId = it[Blog.catId]
    }

    catId?.let {
        category = getCategory(database, it)["catName"]
    }

    return mapOf(
        "id" to id.toString(),
        "title" to title,
        "desc" to desc,
        "date" to date,
        "category" to category
    )
}