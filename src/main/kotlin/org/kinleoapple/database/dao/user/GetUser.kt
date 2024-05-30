package org.kinleoapple.database.dao.user

import org.kinleoapple.database.Database
import org.kinleoapple.database.relation.Quote
import org.kinleoapple.database.relation.User
import org.ktorm.dsl.*

fun getUser(database: Database): Map<String, String?> {
    var name: String? = null
    var quoteId: Long? = 0
    var quote: String? = null
    var quoteName: String? = null

    var result = database.getConnection().from(User)
        .select(User.userName, User.quoteId)
        .where(User.userId eq 0)
    result.forEach {
        name = it[User.userName]
        quoteId = it[User.quoteId]
    }

    quoteId?.let { it ->
        result = database.getConnection().from(Quote)
            .select(Quote.quoteText, Quote.quoteName)
            .where(Quote.quoteId eq it)
        result.forEach {
            quote = it[Quote.quoteText]
            quoteName = it[Quote.quoteName]
        }
    }

    return mapOf(
        "name" to name,
        "quote" to quote,
        "quote_name" to quoteName,
    )
}