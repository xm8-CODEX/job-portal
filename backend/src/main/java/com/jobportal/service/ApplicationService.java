package com.jobportal.service;

import com.jobportal.dto.ApplicationRequestDto;
import com.jobportal.dto.ApplicationResponseDto;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.*;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public ApplicationResponseDto applyForJob(ApplicationRequestDto dto) {
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + dto.getJobId()));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot apply to a job that is not OPEN");
        }

        User seeker = userRepository.findById(dto.getSeekerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getSeekerId()));

        if (seeker.getRole() != Role.SEEKER && seeker.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only job seekers can apply for jobs");
        }

        if (applicationRepository.existsByJobIdAndSeekerId(dto.getJobId(), dto.getSeekerId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied for this job");
        }

        Application application = Application.builder()
                .jobId(dto.getJobId())
                .seekerId(dto.getSeekerId())
                .status(ApplicationStatus.PENDING)
                .resumeUrl(dto.getResumeUrl())
                .build();

        Application savedApplication = applicationRepository.save(application);

        return ApplicationResponseDto.builder()
                .id(savedApplication.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .seekerId(seeker.getId())
                .seekerName(seeker.getName())
                .seekerEmail(seeker.getEmail())
                .status(savedApplication.getStatus())
                .resumeUrl(savedApplication.getResumeUrl())
                .appliedDate(savedApplication.getAppliedDate())
                .build();
    }

    public List<ApplicationResponseDto> getApplicationsBySeeker(Long seekerId) {
        User seeker = userRepository.findById(seekerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seeker not found with ID: " + seekerId));

        List<Application> applications = applicationRepository.findBySeekerIdOrderByAppliedDateDesc(seekerId);

        List<Long> jobIds = applications.stream().map(Application::getJobId).distinct().collect(Collectors.toList());
        Map<Long, String> jobTitleMap = jobRepository.findAllById(jobIds)
                .stream()
                .collect(Collectors.toMap(Job::getId, Job::getTitle));

        return applications.stream()
                .map(app -> ApplicationResponseDto.builder()
                        .id(app.getId())
                        .jobId(app.getJobId())
                        .jobTitle(jobTitleMap.getOrDefault(app.getJobId(), "Unknown Job"))
                        .seekerId(seeker.getId())
                        .seekerName(seeker.getName())
                        .seekerEmail(seeker.getEmail())
                        .status(app.getStatus())
                        .resumeUrl(app.getResumeUrl())
                        .appliedDate(app.getAppliedDate())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getApplicationsByJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        List<Application> applications = applicationRepository.findByJobIdOrderByAppliedDateDesc(jobId);

        List<Long> seekerIds = applications.stream().map(Application::getSeekerId).distinct().collect(Collectors.toList());
        Map<Long, User> seekerMap = userRepository.findAllById(seekerIds)
                .stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return applications.stream()
                .map(app -> {
                    User seeker = seekerMap.get(app.getSeekerId());
                    return ApplicationResponseDto.builder()
                            .id(app.getId())
                            .jobId(job.getId())
                            .jobTitle(job.getTitle())
                            .seekerId(app.getSeekerId())
                            .seekerName(seeker != null ? seeker.getName() : "Unknown Seeker")
                            .seekerEmail(seeker != null ? seeker.getEmail() : "N/A")
                            .status(app.getStatus())
                            .resumeUrl(app.getResumeUrl())
                            .appliedDate(app.getAppliedDate())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponseDto updateApplicationStatus(Long applicationId, String statusStr) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid application status. Allowed values: PENDING, SHORTLISTED, REJECTED, ACCEPTED");
        }

        application.setStatus(newStatus);
        Application updatedApplication = applicationRepository.save(application);

        Job job = jobRepository.findById(updatedApplication.getJobId()).orElse(null);
        User seeker = userRepository.findById(updatedApplication.getSeekerId()).orElse(null);

        return ApplicationResponseDto.builder()
                .id(updatedApplication.getId())
                .jobId(updatedApplication.getJobId())
                .jobTitle(job != null ? job.getTitle() : "Unknown Job")
                .seekerId(updatedApplication.getSeekerId())
                .seekerName(seeker != null ? seeker.getName() : "Unknown Seeker")
                .seekerEmail(seeker != null ? seeker.getEmail() : "N/A")
                .status(updatedApplication.getStatus())
                .resumeUrl(updatedApplication.getResumeUrl())
                .appliedDate(updatedApplication.getAppliedDate())
                .build();
    }
}
