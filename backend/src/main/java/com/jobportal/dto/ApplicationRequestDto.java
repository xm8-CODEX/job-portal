package com.jobportal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRequestDto {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Seeker ID is required")
    private Long seekerId;

    private String resumeUrl;
}
