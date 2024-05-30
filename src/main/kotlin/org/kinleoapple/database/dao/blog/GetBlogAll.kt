package org.kinleoapple.database.dao.blog

import org.kinleoapple.database.Database

fun getBlogAll(database: Database): Map<String, Map<String, String?>> {
    val map: MutableMap<String, Map<String, String?>> = HashMap()
    return mapOf("" to mapOf("" to ""))
}