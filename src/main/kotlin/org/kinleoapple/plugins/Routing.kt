package org.kinleoapple.plugins

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

fun Application.configureRouting() {
    routing {
        staticResources("/", "/static") {
            enableAutoHeadResponse()
            preCompressed(CompressedFileType.BROTLI, CompressedFileType.GZIP)
        }
        singlePageApplication{
            vue("/static")
        }
    }
}
