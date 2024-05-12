package org.kinleoapple

import com.github.yitter.contract.IdGeneratorOptions
import com.github.yitter.idgen.YitIdHelper
import io.ktor.server.application.*
import org.kinleoapple.plugins.configureHTTP
import org.kinleoapple.plugins.configureRouting
import org.kinleoapple.plugins.configureSerialization
import org.kinleoapple.plugins.database.configureDatabase
import org.kinleoapple.plugins.database.relation.*


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    val options = IdGeneratorOptions()
    options.WorkerIdBitLength = 10
    options.SeqBitLength = 10
    YitIdHelper.setIdGenerator(options)

    createQuote()
    createUser()
    createCategory()
    createDraft()
    createBlog()
    createDesigner()

    configureDatabase()
    configureSerialization()
    configureHTTP()
    configureRouting()
}
