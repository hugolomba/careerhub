package com.careerhub.application;

import com.careerhub.application.dto.JobApplicationRequest;
import com.careerhub.application.dto.JobApplicationResponse;
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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Covers RS UC-03 (Manage Job Applications): create/list/update/delete, the
 * status filter, and the ownership check that stops a user from touching
 * another user's application.
 */
@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobApplicationService service;

    private User currentUser;

    @BeforeEach
    void setUp() {
        currentUser = new User(1L, "Hugo Lomba", "hugo@example.com", "hashed", null);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("hugo@example.com", null, List.of()));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void create_savesApplication_forCurrentUser() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
        JobApplicationRequest request = new JobApplicationRequest(
                "Acme Corp", "Backend Engineer", LocalDate.of(2026, 6, 1), null, "https://acme.example/job", "Referred by a friend");

        JobApplicationResponse response = service.create(request);

        assertThat(response.companyName()).isEqualTo("Acme Corp");
        assertThat(response.status()).isEqualTo(ApplicationStatus.APPLIED); // defaults when status is null
        verify(applicationRepository).save(any(JobApplication.class));
    }

    @Test
    void findAllForCurrentUser_filtersByStatus_whenProvided() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
        when(applicationRepository.findByUserIdAndStatus(1L, ApplicationStatus.OFFER)).thenReturn(List.of());

        service.findAllForCurrentUser(ApplicationStatus.OFFER);

        verify(applicationRepository).findByUserIdAndStatus(1L, ApplicationStatus.OFFER);
        verify(applicationRepository, never()).findByUserId(any());
    }

    @Test
    void update_throws_whenApplicationBelongsToAnotherUser() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));

        User otherUser = new User(2L, "Someone Else", "other@example.com", "hashed", null);
        JobApplication existing = new JobApplication();
        existing.setId(99L);
        existing.setUser(otherUser);
        when(applicationRepository.findById(99L)).thenReturn(Optional.of(existing));

        JobApplicationRequest request = new JobApplicationRequest(
                "Acme Corp", "Backend Engineer", LocalDate.of(2026, 6, 1), ApplicationStatus.INTERVIEWING, null, null);

        assertThatThrownBy(() -> service.update(99L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Application not found");

        verify(applicationRepository, never()).save(any());
    }

    @Test
    void delete_removesApplication_whenOwnedByCurrentUser() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));

        JobApplication existing = new JobApplication();
        existing.setId(5L);
        existing.setUser(currentUser);
        when(applicationRepository.findById(5L)).thenReturn(Optional.of(existing));

        service.delete(5L);

        verify(applicationRepository).delete(existing);
    }

    @Test
    void findOne_throws_whenApplicationDoesNotExist() {
        when(applicationRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findOne(404L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Application not found");
    }
}
