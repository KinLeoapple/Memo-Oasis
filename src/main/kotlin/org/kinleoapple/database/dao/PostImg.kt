package org.kinleoapple.database.dao

import com.github.yitter.idgen.YitIdHelper
import io.ktor.http.content.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Image
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update
import java.io.File
import java.time.LocalDateTime

/**
 * Return a map of the get image result.
 *
 * @param database The database which wish to search.
 * @param form The data of the form.
 * @param id The id of the image.
 * @return A map of the post image result.
 */
suspend fun postImg(database: Database, form: MultiPartData, id: Long?): Map<String, String?> {
    var newId: Long? = null
    form.forEachPart { part ->
        if (part is PartData.FileItem && part.name == "file") {
            newId = id ?: YitIdHelper.nextId()
            val fileBytes = part.streamProvider().readBytes()

            val saveTo = File("./img/${newId}.${part.contentType.toString().replace("image/", "")}")
            saveTo.parentFile.mkdirs()
            if (!saveTo.exists()) {
                saveTo.createNewFile()
            }
            saveTo.writeBytes(fileBytes)

            // store to database
            try {
                database.connection.insert(Image) {
                    set(it.imgId, newId)
                    set(it.imgPath, saveTo.path)
                    set(it.imgPubDt, LocalDateTime.now())
                }
            } catch (e: Exception) {
                database.connection.update(Image) {
                    set(it.imgPath, saveTo.path)
                    set(it.imgPubDt, LocalDateTime.now())
                    where {
                        it.imgId eq newId!!
                    }
                }
            }
        } else
            return@forEachPart
    }
    return mapOf("saved" to (if (newId != null) "$newId" else null))
}