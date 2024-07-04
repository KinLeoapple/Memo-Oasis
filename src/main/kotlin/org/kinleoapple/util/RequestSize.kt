package org.kinleoapple.util

import io.ktor.server.application.*

fun requestSize(call: ApplicationCall): Int {
    val sizePar = call.request.queryParameters["size"]
    var size = 5
    sizePar?.let {
        size = it.toInt()
    }
    return size
}