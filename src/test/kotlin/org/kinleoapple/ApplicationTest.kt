package org.kinleoapple

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*
import org.kinleoapple.plugins.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureRouting()
        }
//        client.get("/").apply {
//            assertEquals(HttpStatusCode.OK, status)
//        }
    }
}
