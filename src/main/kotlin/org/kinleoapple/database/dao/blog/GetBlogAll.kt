package org.kinleoapple.database.dao.blog

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Blog
import org.ktorm.dsl.forEach
import org.ktorm.dsl.from
import org.ktorm.dsl.select

fun getBlogAll(database: Database): Map<String, Map<String, String?>> {
    val map: MutableMap<String, Map<String, String?>> = HashMap()

    val result = database.getConnection().from(Blog)
        .select(Blog.blogId)

    result.forEach {
        val blogId: Long? = it[Blog.blogId]

        val category = mapOf(
            "id" to "$blogId",
        )
        map["$blogId"] = category
    }
    return map.toMap()
}