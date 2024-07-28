package org.kinleoapple

import io.ktor.server.testing.*
import kotlin.test.*
import org.kinleoapple.plugins.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureResources()
        }
//        client.get("/").apply {
//            assertEquals(HttpStatusCode.OK, status)
//        }
    }
}
