package org.kinleoapple.database.util

import com.github.yitter.idgen.YitIdHelper

fun generateId(id: Long?): Long {
    var identity: Long? = null
    id?.let {
        identity = if (it < 0)
            null
        else
            it
    }
    val newId = identity ?: YitIdHelper.nextId()
    return newId
}

fun generateId(): Long {
    val newId = YitIdHelper.nextId()
    return newId
}