package org.kinleoapple.dataclass

import com.google.gson.annotations.SerializedName

data class DeleteDraftData(
    @SerializedName("draft_id")
    val draftId: String,
)