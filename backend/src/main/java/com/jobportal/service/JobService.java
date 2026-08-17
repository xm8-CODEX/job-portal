package com.jobportal.service;

import com.jobportal.dto.JobRequestDto;
import com.jobportal.dto.JobResponseDto;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.model.JobStatus;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public JobResponseDto createJob(JobRequestDto dto) {
        User recruiter = userRepository.findById(dto.getRecruiterId())
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with ID: " + dto.getRecruiterId()));

        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("User with ID " + dto.getRecruiterId() + " is not authorized to post jobs");
        }

        Job job = Job.builder()
                .title(dto.getTitle().trim())
                .description(dto.getDescription().trim())
                .location(dto.getLocation().trim())
                .salary(dto.getSalary())
                .experience(dto.getExperience())
                .status(dto.getStatus() != null ? dto.getStatus() : JobStatus.OPEN)
                .recruiterId(dto.getRecruiterId())
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToResponseDto(savedJob, recruiter.getName());
    }

    public List<JobResponseDto> getAllJobs(String location, String title, Double minSalary) {
        List<Job> jobs;
        if ((location != null && !location.isBlank()) ||
            (title != null && !title.isBlank()) ||
            minSalary != null) {
            jobs = jobRepository.filterJobs(
                    location != null ? location.trim() : null,
                    title != null ? title.trim() : null,
                    minSalary
            );
        } else {
            jobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN);
        }

        return enrichWithRecruiterNames(jobs);
    }

    public JobResponseDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        String recruiterName = userRepository.findById(job.getRecruiterId())
                .map(User::getName)
                .orElse("Unknown Recruiter");

        return mapToResponseDto(job, recruiterName);
    }

    public List<JobResponseDto> getJobsByRecruiter(Long recruiterId) {
        if (!userRepository.existsById(recruiterId)) {
            throw new ResourceNotFoundException("Recruiter not found with ID: " + recruiterId);
        }

        List<Job> jobs = jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterId);
        return enrichWithRecruiterNames(jobs);
    }

    @Transactional
    public JobResponseDto updateJob(Long id, JobRequestDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        job.setTitle(dto.getTitle().trim());
        job.setDescription(dto.getDescription().trim());
        job.setLocation(dto.getLocation().trim());
        job.setSalary(dto.getSalary());
        job.setExperience(dto.getExperience());
        if (dto.getStatus() != null) {
            job.setStatus(dto.getStatus());
        }

        Job updatedJob = jobRepository.save(job);

        String recruiterName = userRepository.findById(updatedJob.getRecruiterId())
                .map(User::getName)
                .orElse("Unknown Recruiter");

        return mapToResponseDto(updatedJob, recruiterName);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with ID: " + id);
        }

        applicationRepository.deleteByJobId(id);
        jobRepository.deleteById(id);
    }

    private List<JobResponseDto> enrichWithRecruiterNames(List<Job> jobs) {
        List<Long> recruiterIds = jobs.stream()
                .map(Job::getRecruiterId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, String> recruiterNameMap = userRepository.findAllById(recruiterIds)
                .stream()
                .collect(Collectors.toMap(User::getId, User::getName));

        return jobs.stream()
                .map(job -> mapToResponseDto(job, recruiterNameMap.getOrDefault(job.getRecruiterId(), "Unknown Recruiter")))
                .collect(Collectors.toList());
    }

    private JobResponseDto mapToResponseDto(Job job, String recruiterName) {
        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .experience(job.getExperience())
                .status(job.getStatus())
                .recruiterId(job.getRecruiterId())
                .recruiterName(recruiterName)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
