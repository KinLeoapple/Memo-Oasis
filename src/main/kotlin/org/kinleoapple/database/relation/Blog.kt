package org.kinleoapple.database.relation

import org.ktorm.schema.Table
import org.ktorm.schema.datetime
import org.ktorm.schema.long
import org.ktorm.schema.varchar

private const val TABLE_NAME = "blog"

data object Blog: Table<Nothing>(TABLE_NAME) {
    val blogId = long("blog_id").primaryKey()
    val catId = long("cat_id")
    val blogPubDt = datetime("blog_pub_dt")
    val blogPath = varchar("blog_path")
    val blogTitle = varchar("blog_title")
    val blogDes = varchar("blog_des")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `$TABLE_NAME` (
          `blog_id` BIGINT NOT NULL,
          `cat_id` BIGINT NOT NULL,
          `blog_pub_dt` DATETIME NOT NULL,
          `blog_path` VARCHAR(100) NOT NULL,
          `blog_title` VARCHAR(100) NOT NULL,
          `blog_des` VARCHAR(1000) NOT NULL,
          PRIMARY KEY (`blog_id`),
          FOREIGN KEY (`cat_id`) REFERENCES `category` (`cat_id`));
""".trimIndent()

fun createBlog(): String {
    return sql
}