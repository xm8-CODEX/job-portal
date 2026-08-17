package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformStatsDto {

    private long totalUsers;
    private long totalSeekers;
    private long totalRecruiters;
    private long totalJobs;
    private long openJobs;
    private long totalApplications;
}
