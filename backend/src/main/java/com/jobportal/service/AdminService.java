package com.jobportal.service;

import com.jobportal.dto.PlatformStatsDto;
import com.jobportal.dto.UserResponseDto;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (user.getRole() == Role.SEEKER) {
            applicationRepository.deleteBySeekerId(id);
        } else if (user.getRole() == Role.RECRUITER) {
            List<Job> recruiterJobs = jobRepository.findByRecruiterIdOrderByCreatedAtDesc(id);
            for (Job job : recruiterJobs) {
                applicationRepository.deleteByJobId(job.getId());
            }
            jobRepository.deleteAll(recruiterJobs);
        }

        userRepository.delete(user);
    }

    public PlatformStatsDto getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalSeekers = userRepository.countByRole(Role.SEEKER);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalJobs = jobRepository.count();
        long openJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long totalApplications = applicationRepository.count();

        return PlatformStatsDto.builder()
                .totalUsers(totalUsers)
                .totalSeekers(totalSeekers)
                .totalRecruiters(totalRecruiters)
                .totalJobs(totalJobs)
                .openJobs(openJobs)
                .totalApplications(totalApplications)
                .build();
    }
}
