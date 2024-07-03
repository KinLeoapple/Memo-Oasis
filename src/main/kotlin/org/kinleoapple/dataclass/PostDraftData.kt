package org.kinleoapple.dataclass

import com.google.gson.annotations.SerializedName

data class PostDraftData(
    @SerializedName("title")
    val title: String,
    @SerializedName("draft")
    val draft: String,
)