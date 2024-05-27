package org.kinleoapple.database.dao

import com.github.yitter.idgen.YitIdHelper
import io.ktor.http.content.*
import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Image
import org.kinleoapple.security.verifyUser
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
    var name: String? = null
    var hash: String? = null
    var newId: Long? = null
    var fileBytes: ByteArray? = null
    var saveTo: File? = null

    form.forEachPart { part ->
        when (part) {
            is PartData.BinaryChannelItem -> return@forEachPart
            is PartData.BinaryItem -> return@forEachPart
            is PartData.FileItem -> {
                newId = id ?: YitIdHelper.nextId()
                fileBytes = part.streamProvider().readBytes()

                saveTo = File("./img/${newId}.${part.contentType.toString().replace("image/", "")}")
                saveTo!!.parentFile.mkdirs()
                if (!saveTo!!.exists()) {
                    saveTo!!.createNewFile()
                }
            }
            is PartData.FormItem -> {
                when (part.name) {
                    "name" -> name = part.value
                    "hash" -> hash = part.value
                }
            }
        }
    }
    if (saveTo != null && fileBytes != null && name != null && hash != null) {
        if (verifyUser(database, name!!, hash!!)) {
            saveTo!!.writeBytes(fileBytes!!)
            // store to database
            try {
                database.getConnection().insert(Image) {
                    set(it.imgId, newId)
                    set(it.imgPath, saveTo!!.path)
                    set(it.imgPubDt, LocalDateTime.now())
                }
            } catch (e: Exception) {
                database.getConnection().update(Image) {
                    set(it.imgPath, saveTo!!.path)
                    set(it.imgPubDt, LocalDateTime.now())
                    where {
                        it.imgId eq newId!!
                    }
                }
            }
            return mapOf("saved" to (if (newId != null) "$newId" else null))
        } else
            return mapOf("saved" to null)
    } else
        return mapOf("saved" to null)
}