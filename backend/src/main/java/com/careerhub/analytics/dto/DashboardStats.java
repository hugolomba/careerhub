package com.careerhub.analytics.dto;

import com.careerhub.application.ApplicationStatus;

import java.util.List;
import java.util.Map;

public record DashboardStats(
        long totalApplications,
        double responseRatePercent,        // % of applications where the company responded (status != APPLIED)
        double interviewConversionRatePercent, // % of applications that reached at least one interview
        double offerRatePercent,           // % of applications that resulted in an offer
        Map<ApplicationStatus, Long> applicationsByStatus,
        List<MonthlyActivity> activityTrend // applications created per month, for the trend chart
) {
    public record MonthlyActivity(String month, long count) {} // month format: "yyyy-MM"
}