package org.kinleoapple.database.dao.blog

import io.ktor.server.application.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Blog
import org.ktorm.dsl.*

/**
 * Return a map of the all blog result.
 *
 * @param database The database which wish to search.
 * @return A map of the blog result.
 */
fun getBlogAll(database: Database, call: ApplicationCall): Map<String, Map<String, String?>> {
    val offsetPar = call.request.queryParameters["offset"]
    var offset = 0
    offsetPar?.let {
        offset = it.toInt()
    }
    val sizePar = call.request.queryParameters["size"]
    var size = 5
    sizePar?.let {
        size = it.toInt()
    }

    val map: MutableMap<String, Map<String, String?>> = HashMap()

    val result = database.getConnection().from(Blog)
        .select(Blog.blogId, Blog.blogPubDt)
        .limit(offset, size)
        .orderBy(Blog.blogPubDt.asc())

    result.forEach {
        val blogId: Long? = it[Blog.blogId]

        val category = mapOf(
            "id" to "$blogId",
        )
        map["$blogId"] = category
    }
    return map.toMap()
}