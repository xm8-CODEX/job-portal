package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequestDto;
import com.jobportal.dto.ApplicationResponseDto;
import com.jobportal.dto.StatusUpdateRequestDto;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponseDto> applyForJob(@Valid @RequestBody ApplicationRequestDto requestDto) {
        ApplicationResponseDto response = applicationService.applyForJob(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/seeker/{seekerId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsBySeeker(@PathVariable Long seekerId) {
        List<ApplicationResponseDto> applications = applicationService.getApplicationsBySeeker(seekerId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsByJob(@PathVariable Long jobId) {
        List<ApplicationResponseDto> applications = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponseDto> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto statusDto
    ) {
        ApplicationResponseDto updated = applicationService.updateApplicationStatus(id, statusDto.getStatus());
        return ResponseEntity.ok(updated);
    }
}
