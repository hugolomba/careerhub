package com.careerhub.cv;

import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

/**
 * Covers RS UC-05 (Upload CV Versions): allowed file types, the ownership
 * check on download/delete, and that a CV can optionally be linked to one
 * of the user's applications.
 */
@ExtendWith(MockitoExtension.class)
class CvServiceTest {

    @Mock
    private CvRepository cvRepository;
    @Mock
    private com.careerhub.application.JobApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;

    private CvService service;
    private User currentUser;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        currentUser = new User(1L, "Hugo Lomba", "hugo@example.com", "hashed", null);
        service = new CvService(cvRepository, applicationRepository, userRepository, tempDir.toString());

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("hugo@example.com", null, List.of()));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void upload_storesFile_whenExtensionIsAllowed() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
        MockMultipartFile file = new MockMultipartFile("file", "resume.pdf", "application/pdf", "content".getBytes());

        service.upload(file, "Main CV", null);

        ArgumentCaptor<CvDocument> captor = ArgumentCaptor.forClass(CvDocument.class);
        verify(cvRepository).save(captor.capture());
        assertThat(captor.getValue().getFileName()).isEqualTo("resume.pdf");
        assertThat(captor.getValue().getLabel()).isEqualTo("Main CV");
    }

    @Test
    void upload_throws_whenExtensionIsNotAllowed() {
        MockMultipartFile file = new MockMultipartFile("file", "resume.exe", "application/octet-stream", "content".getBytes());

        assertThatThrownBy(() -> service.upload(file, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only PDF or DOCX");

        verify(cvRepository, never()).save(any());
    }

    @Test
    void upload_throws_whenFileIsEmpty() {
        MockMultipartFile file = new MockMultipartFile("file", "resume.pdf", "application/pdf", new byte[0]);

        assertThatThrownBy(() -> service.upload(file, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("empty");
    }

    @Test
    void delete_throws_whenCvBelongsToAnotherUser() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
        User otherUser = new User(2L, "Someone Else", "other@example.com", "hashed", null);
        CvDocument cv = new CvDocument();
        cv.setId(7L);
        cv.setUser(otherUser);
        when(cvRepository.findById(7L)).thenReturn(Optional.of(cv));

        assertThatThrownBy(() -> service.delete(7L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CV not found");

        verify(cvRepository, never()).delete(any());
    }

    @Test
    void delete_removesRecord_whenOwnedByCurrentUser() {
        when(userRepository.findByEmail("hugo@example.com")).thenReturn(Optional.of(currentUser));
        CvDocument cv = new CvDocument();
        cv.setId(7L);
        cv.setUser(currentUser);
        cv.setFilePath(tempDir.resolve("does-not-exist.pdf").toString());
        when(cvRepository.findById(7L)).thenReturn(Optional.of(cv));

        service.delete(7L);

        verify(cvRepository).delete(cv);
    }
}
