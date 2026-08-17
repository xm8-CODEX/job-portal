package com.jobportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Job title cannot be blank")
    @Column(nullable = false)
    private String title;

    @Lob
    @NotBlank(message = "Job description cannot be blank")
    @Column(nullable = false)
    private String description;

    @NotBlank(message = "Location cannot be blank")
    @Column(nullable = false)
    private String location;

    @Column(nullable = true)
    private Double salary;

    @Column(nullable = true)
    private String experience;

    @NotNull(message = "Job status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @NotNull(message = "Recruiter ID is required")
    @Column(name = "recruiter_id", nullable = false)
    private Long recruiterId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
