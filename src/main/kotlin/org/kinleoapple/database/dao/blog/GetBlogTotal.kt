package org.kinleoapple.database.dao.blog

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Blog
import org.ktorm.dsl.from
import org.ktorm.dsl.select

fun getBolgTotal(database: Database): Map<String, Int> {
    val total = database.getConnection().from(Blog)
        .select(Blog.blogId)
        .totalRecordsInAllPages
    return mapOf("total" to total)
}