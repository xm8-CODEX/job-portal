package com.jobportal.repository;

import com.jobportal.model.Job;
import com.jobportal.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);

    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    List<Job> findByRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    List<Job> findByLocationIgnoreCase(String location);

    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);

    long countByStatus(JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND (" +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchOpenJobs(@Param("keyword") String keyword);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' " +
           "AND (:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:title IS NULL OR :title = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:minSalary IS NULL OR j.salary >= :minSalary) " +
           "ORDER BY j.createdAt DESC")
    List<Job> filterJobs(@Param("location") String location,
                         @Param("title") String title,
                         @Param("minSalary") Double minSalary);
}
