package org.kinleoapple.plugins.sqlite.database.dao.blog

import io.ktor.server.application.*
import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.relation.Blog
import org.kinleoapple.util.requestOffset
import org.kinleoapple.util.requestSize
import org.ktorm.dsl.*

/**
 * Return a map of the all blog result.
 *
 * @param database The database which wish to search.
 * @return A map of the blog result.
 */
fun getBlogAll(database: Database, call: ApplicationCall): Map<String, Map<String, String?>> {
    val offset = requestOffset(call)
    val size = requestSize(call)

    val map: MutableMap<String, Map<String, String?>> = HashMap()

    val result = database.getConnection().from(Blog)
        .select(Blog.blogId, Blog.blogPubDt)
        .limit(offset, size)
        .orderBy(Blog.blogPubDt.asc())

    result.forEach {
        val blogId: Long? = it[Blog.blogId]

        val blog = mapOf(
            "id" to "$blogId",
        )
        map["$blogId"] = blog
    }
    return map.toMap()
}