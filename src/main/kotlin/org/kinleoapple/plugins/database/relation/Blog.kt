package org.kinleoapple.plugins.database.relation

import io.ktor.server.application.*
import org.kinleoapple.plugins.database.Database
import org.kinleoapple.plugins.database.configureDatabase
import org.ktorm.schema.Table
import org.ktorm.schema.datetime
import org.ktorm.schema.int
import org.ktorm.schema.varchar

private const val TABLE_NAME = "blog"

data object Blog: Table<Nothing>(TABLE_NAME) {
    val blogId = int("blog_id").primaryKey()
    val catId = int("cat_id")
    val blogPubDt = datetime("blog_pub_dt")
    val blogPath = varchar("blog_path")
    val blogTitle = varchar("blog_title")
    val blogDes = varchar("blog_des")
}

private val sql: String = """
    CREATE TABLE IF NOT EXISTS `memo`.`${TABLE_NAME}` (
          `blog_id` INT NOT NULL,
          `cat_id` INT NOT NULL,
          `blog_pub_dt` DATETIME NOT NULL,
          `blog_path` VARCHAR(100) NOT NULL,
          `blog_title` VARCHAR(100) NOT NULL,
          `blog_des` VARCHAR(1000) NOT NULL,
          PRIMARY KEY (`blog_id`),
          INDEX `cat_id_idx` (`cat_id` ASC) VISIBLE,
          CONSTRAINT `cat_id`
            FOREIGN KEY (`cat_id`)
            REFERENCES `memo`.`category` (`cat_id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION);
""".trimIndent()

fun Application.createBlog() {
    val database = Database(configureDatabase())
    val conn = database.nativeConnect()
    val statement = conn?.createStatement()
    sql.split(";\n").forEach {
        statement?.executeUpdate(it)
    }
}