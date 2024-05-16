package org.kinleoapple.plugins

import com.github.yitter.contract.IdGeneratorOptions
import com.github.yitter.idgen.YitIdHelper
import io.ktor.server.application.*

fun Application.configureIdGenerator() {
    val options = IdGeneratorOptions()
    options.WorkerIdBitLength = 10
    options.SeqBitLength = 10
    YitIdHelper.setIdGenerator(options)
}