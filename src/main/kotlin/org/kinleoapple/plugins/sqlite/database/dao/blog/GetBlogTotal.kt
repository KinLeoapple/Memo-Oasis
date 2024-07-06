package org.kinleoapple.plugins.sqlite.database.dao.blog

import org.kinleoapple.plugins.sqlite.database.Database
import org.kinleoapple.plugins.sqlite.database.relation.Blog
import org.ktorm.dsl.from
import org.ktorm.dsl.select

/**
 * Return a map of the blog total count.
 *
 * @param database The database which wish to search.
 * @return A map of the blog total count.
 */
fun getBolgTotal(database: Database): Map<String, Int> {
    val total = database.getConnection().from(Blog)
        .select(Blog.blogId)
        .totalRecordsInAllPages
    return mapOf("total" to total)
}