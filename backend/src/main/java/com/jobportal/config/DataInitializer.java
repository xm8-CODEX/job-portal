package com.jobportal.config;

import com.jobportal.model.*;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed demo accounts if database is fresh
        if (userRepository.count() == 0) {
            System.out.println(">>> [NaukriSetu] Seeding Initial Demo Data for College Presentation...");

            // 1. Demo Admin
            User admin = User.builder()
                    .name("System Administrator")
                    .email("admin@naukrisetu.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            // 2. Demo Recruiter
            User recruiter = User.builder()
                    .name("Tech Mahindra HR")
                    .email("recruiter@techm.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(Role.RECRUITER)
                    .build();
            User savedRecruiter = userRepository.save(recruiter);

            // 3. Demo Job Seeker
            User seeker = User.builder()
                    .name("Rahul Sharma")
                    .email("rahul@gmail.com")
                    .password(passwordEncoder.encode("seeker123"))
                    .role(Role.SEEKER)
                    .build();
            User savedSeeker = userRepository.save(seeker);

            // 4. Sample Jobs
            Job job1 = Job.builder()
                    .title("Java Spring Boot Developer")
                    .description("Looking for passionate Java developers with expertise in Spring Boot 3, REST APIs, and JPA. Experience with relational databases like MySQL/Oracle.")
                    .location("Pune, Maharashtra")
                    .salary(650000.0)
                    .experience("0-2 years")
                    .status(JobStatus.OPEN)
                    .recruiterId(savedRecruiter.getId())
                    .build();
            Job savedJob1 = jobRepository.save(job1);

            Job job2 = Job.builder()
                    .title("React & Frontend Specialist")
                    .description("Developing modern responsive web apps using React, Tailwind CSS, and i18next multi-language support. Good knowledge of state management.")
                    .location("Mumbai, Maharashtra")
                    .salary(580000.0)
                    .experience("1-3 years")
                    .status(JobStatus.OPEN)
                    .recruiterId(savedRecruiter.getId())
                    .build();
            jobRepository.save(job2);

            Job job3 = Job.builder()
                    .title("Junior Database Administrator")
                    .description("Managing MySQL and Oracle database instances, writing optimized queries, creating tables and handling backup/restore workflows.")
                    .location("Remote / Hybrid")
                    .salary(500000.0)
                    .experience("Freshers / 0-1 year")
                    .status(JobStatus.OPEN)
                    .recruiterId(savedRecruiter.getId())
                    .build();
            jobRepository.save(job3);

            // 5. Sample Application
            Application app = Application.builder()
                    .jobId(savedJob1.getId())
                    .seekerId(savedSeeker.getId())
                    .status(ApplicationStatus.SHORTLISTED)
                    .resumeUrl("https://linkedin.com/in/demo-rahul")
                    .build();
            applicationRepository.save(app);

            System.out.println(">>> [NaukriSetu] Demo Data Initialized Successfully!");
            System.out.println(">>> Admin Login: admin@naukrisetu.com / admin123");
            System.out.println(">>> Recruiter Login: recruiter@techm.com / recruiter123");
            System.out.println(">>> Seeker Login: rahul@gmail.com / seeker123");
        }
    }
}
