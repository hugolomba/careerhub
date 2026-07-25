package com.careerhub.analytics;

import com.careerhub.analytics.dto.DashboardStats;
import com.careerhub.application.ApplicationStatus;
import com.careerhub.application.JobApplication;
import com.careerhub.application.JobApplicationRepository;
import com.careerhub.interview.InterviewRepository;
import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    public AnalyticsService(JobApplicationRepository applicationRepository,
                            InterviewRepository interviewRepository,
                            UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.userRepository = userRepository;
    }

    public DashboardStats getDashboardStats() {
        User user = currentUser();
        List<JobApplication> applications = applicationRepository.findByUserId(user.getId());

        long total = applications.size();

        // Applications by status (for the "applications by status" chart)
        Map<ApplicationStatus, Long> byStatus = applications.stream()
                .collect(Collectors.groupingBy(JobApplication::getStatus, Collectors.counting()));

        // Response rate: any application that moved past APPLIED means the company responded
        long responded = applications.stream().filter(a -> a.getStatus() != ApplicationStatus.APPLIED).count();

        // Interview conversion: applications that have at least one logged interview
        long withInterview = applications.stream()
                .filter(a -> !interviewRepository.findByApplicationId(a.getId()).isEmpty())
                .count();

        long offers = byStatus.getOrDefault(ApplicationStatus.OFFER, 0L);

        // Activity trend: applications grouped by the month they were created
        Map<String, Long> trendMap = applications.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCreatedAt().format(MONTH_FORMAT),
                        Collectors.counting()
                ));
        List<DashboardStats.MonthlyActivity> trend = trendMap.entrySet().stream()
                .map(e -> new DashboardStats.MonthlyActivity(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(DashboardStats.MonthlyActivity::month))
                .toList();

        return new DashboardStats(
                total,
                percentage(responded, total),
                percentage(withInterview, total),
                percentage(offers, total),
                byStatus,
                trend
        );
    }

    private double percentage(long part, long total) {
        if (total == 0) return 0.0;
        return Math.round((part * 10000.0) / total) / 100.0; // 2 decimal places
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }
}