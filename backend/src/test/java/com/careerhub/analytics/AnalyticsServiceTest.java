package com.careerhub.analytics;

import com.careerhub.analytics.dto.DashboardStats;
import com.careerhub.application.ApplicationStatus;
import com.careerhub.application.JobApplication;
import com.careerhub.application.JobApplicationRepository;
import com.careerhub.interview.Interview;
import com.careerhub.interview.InterviewRepository;
import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Covers RS UC-06 (View Analytics Dashboard): the empty-state (no
 * applications yet) and the percentage/aggregation math behind the KPI
 * cards and charts.
 */
@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private JobApplicationRepository applicationRepository;
    @Mock
    private InterviewRepository interviewRepository;
    @Mock
    private UserRepository userRepository;

    private AnalyticsService service;
    private User currentUser;

    @BeforeEach
    void setUp() {
        service = new AnalyticsService(applicationRepository, interviewRepository, userRepository);
        currentUser = new User(1L, "Hugo Lomba", "hugo@example.com", "hashed", null);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("hugo@example.com", null, List.of()));
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getDashboardStats_returnsZeroedStats_whenUserHasNoApplications() {
        when(applicationRepository.findByUserId(1L)).thenReturn(List.of());

        DashboardStats stats = service.getDashboardStats();

        assertThat(stats.totalApplications()).isZero();
        assertThat(stats.responseRatePercent()).isZero();
        assertThat(stats.activityTrend()).isEmpty();
    }

    @Test
    void getDashboardStats_computesRates_acrossApplicationsAndInterviews() {
        JobApplication applied = application(1L, ApplicationStatus.APPLIED);
        JobApplication interviewing = application(2L, ApplicationStatus.INTERVIEWING);
        JobApplication offer = application(3L, ApplicationStatus.OFFER);
        when(applicationRepository.findByUserId(1L)).thenReturn(List.of(applied, interviewing, offer));

        when(interviewRepository.findByApplicationId(1L)).thenReturn(List.of());
        when(interviewRepository.findByApplicationId(2L)).thenReturn(List.of(new Interview()));
        when(interviewRepository.findByApplicationId(3L)).thenReturn(List.of(new Interview()));

        DashboardStats stats = service.getDashboardStats();

        assertThat(stats.totalApplications()).isEqualTo(3);
        // 2 of 3 applications moved past APPLIED -> 66.67%
        assertThat(stats.responseRatePercent()).isEqualTo(66.67);
        // 2 of 3 applications have at least one interview -> 66.67%
        assertThat(stats.interviewConversionRatePercent()).isEqualTo(66.67);
        // 1 of 3 applications resulted in an offer -> 33.33%
        assertThat(stats.offerRatePercent()).isEqualTo(33.33);
        assertThat(stats.applicationsByStatus()).containsEntry(ApplicationStatus.OFFER, 1L);
    }

    private JobApplication application(Long id, ApplicationStatus status) {
        JobApplication app = new JobApplication();
        app.setId(id);
        app.setUser(currentUser);
        app.setStatus(status);
        app.setApplicationDate(LocalDate.now());
        return app;
    }
}
