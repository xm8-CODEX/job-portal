package com.jobportal.repository;

import com.jobportal.model.Application;
import com.jobportal.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobIdOrderByAppliedDateDesc(Long jobId);

    List<Application> findBySeekerIdOrderByAppliedDateDesc(Long seekerId);

    Optional<Application> findByJobIdAndSeekerId(Long jobId, Long seekerId);

    Boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByJobIdAndStatus(Long jobId, ApplicationStatus status);

    long countByJobId(Long jobId);

    long countByStatus(ApplicationStatus status);

    void deleteByJobId(Long jobId);

    void deleteBySeekerId(Long seekerId);
}
