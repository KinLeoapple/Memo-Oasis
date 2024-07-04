package org.kinleoapple.util

import io.ktor.server.application.*

fun requestOffset(call: ApplicationCall): Int {
    val offsetPar = call.request.queryParameters["offset"]
    var offset = 0
    offsetPar?.let {
        offset = it.toInt()
    }
    return offset
}