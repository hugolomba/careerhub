package com.careerhub.analytics;

import com.careerhub.analytics.dto.DashboardStats;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/dashboard/stats")
    public DashboardStats getStats() {
        return analyticsService.getDashboardStats();
    }
}