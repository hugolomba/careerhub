package com.careerhub.interview;

import com.careerhub.application.JobApplication;
import com.careerhub.application.JobApplicationRepository;
import com.careerhub.interview.dto.InterviewRequest;
import com.careerhub.interview.dto.InterviewResponse;
import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Covers RS UC-04 (Manage Interviews), including the ownership checks that
 * make sure a user can only see/edit interviews on their own applications,
 * and the "past date" flag used by the E1 warning in the frontend.
 */
@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;
    @Mock
    private JobApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private InterviewService service;

    private User currentUser;
    private JobApplication application;

    @BeforeEach
    void setUp() {
        currentUser = new User(1L, "Hugo Lomba", "hugo@example.com", "hashed", null);
        application = new JobApplication();
        application.setId(10L);
        application.setUser(currentUser);
        application.setCompanyName("Acme Corp");
        application.setJobTitle("Backend Engineer");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("hugo@example.com", null, List.of()));
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void create_savesInterview_whenApplicationIsOwnedByCurrentUser() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        InterviewRequest request = new InterviewRequest(
                LocalDateTime.now().plusDays(3), InterviewType.VIDEO, "Technical round", "Bring laptop");

        InterviewResponse response = service.create(10L, request);

        assertThat(response.companyName()).isEqualTo("Acme Corp");
        assertThat(response.pastDate()).isFalse();
        verify(interviewRepository).save(any(Interview.class));
    }

    @Test
    void create_throws_whenApplicationBelongsToAnotherUser() {
        User otherUser = new User(2L, "Someone Else", "other@example.com", "hashed", null);
        JobApplication othersApplication = new JobApplication();
        othersApplication.setId(11L);
        othersApplication.setUser(otherUser);
        when(applicationRepository.findById(11L)).thenReturn(Optional.of(othersApplication));

        InterviewRequest request = new InterviewRequest(LocalDateTime.now(), InterviewType.PHONE, null, null);

        assertThatThrownBy(() -> service.create(11L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Application not found");

        verify(interviewRepository, never()).save(any());
    }

    @Test
    void toResponse_flagsPastDate_whenInterviewDateHasAlreadyPassed() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        InterviewRequest request = new InterviewRequest(
                LocalDateTime.now().minusDays(1), InterviewType.PHONE, "Screening", null);

        InterviewResponse response = service.create(10L, request);

        assertThat(response.pastDate()).isTrue();
    }

    @Test
    void delete_throws_whenInterviewBelongsToAnotherUsersApplication() {
        User otherUser = new User(2L, "Someone Else", "other@example.com", "hashed", null);
        JobApplication othersApplication = new JobApplication();
        othersApplication.setId(11L);
        othersApplication.setUser(otherUser);

        Interview interview = new Interview();
        interview.setId(50L);
        interview.setApplication(othersApplication);
        when(interviewRepository.findById(50L)).thenReturn(Optional.of(interview));

        assertThatThrownBy(() -> service.delete(50L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Interview not found");

        verify(interviewRepository, never()).delete(any());
    }

    @Test
    void findAllForCurrentUser_returnsInterviewsAcrossAllOfTheUsersApplications() {
        Interview interview = new Interview();
        interview.setId(50L);
        interview.setApplication(application);
        interview.setInterviewDate(LocalDateTime.now().plusDays(1));
        interview.setType(InterviewType.ONSITE);
        when(interviewRepository.findByApplication_UserId(1L)).thenReturn(List.of(interview));

        List<InterviewResponse> responses = service.findAllForCurrentUser();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).jobTitle()).isEqualTo("Backend Engineer");
    }
}
