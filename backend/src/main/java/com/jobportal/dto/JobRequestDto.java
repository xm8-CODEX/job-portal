package com.jobportal.dto;

import com.jobportal.model.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequestDto {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @PositiveOrZero(message = "Salary must be zero or positive")
    private Double salary;

    private String experience;

    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @NotNull(message = "Recruiter ID is required")
    private Long recruiterId;
}
