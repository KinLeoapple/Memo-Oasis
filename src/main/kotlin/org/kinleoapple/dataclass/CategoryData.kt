package org.kinleoapple.dataclass

import com.google.gson.annotations.SerializedName

data class CategoryData(
    @SerializedName("catName")
    val catName: String,
)