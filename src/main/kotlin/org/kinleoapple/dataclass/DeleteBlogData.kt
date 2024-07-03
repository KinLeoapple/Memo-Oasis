package org.kinleoapple.dataclass

import com.google.gson.annotations.SerializedName

data class DeleteBlogData(
    @SerializedName("blog_id")
    val blogId: String,
)