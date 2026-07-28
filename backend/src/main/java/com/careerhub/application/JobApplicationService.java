package com.careerhub.application;

import com.careerhub.application.dto.JobApplicationRequest;
import com.careerhub.application.dto.JobApplicationResponse;
import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobApplicationService(JobApplicationRepository applicationRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public List<JobApplicationResponse> findAllForCurrentUser(ApplicationStatus statusFilter) {
        User user = currentUser();
        List<JobApplication> apps = statusFilter == null
                ? applicationRepository.findByUserId(user.getId())
                : applicationRepository.findByUserIdAndStatus(user.getId(), statusFilter);
        return apps.stream().map(this::toResponse).toList();
    }

    public JobApplicationResponse create(JobApplicationRequest request) {
        User user = currentUser();
        JobApplication app = new JobApplication();
        app.setUser(user);
        applyRequest(app, request);
        applicationRepository.save(app);
        return toResponse(app);
    }

    public JobApplicationResponse update(Long id, JobApplicationRequest request) {
        JobApplication app = findOwnedOrThrow(id);
        applyRequest(app, request);
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
        return toResponse(app);
    }

    public void delete(Long id) {
        JobApplication app = findOwnedOrThrow(id);
        applicationRepository.delete(app);
    }

    private JobApplication findOwnedOrThrow(Long id) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        if (!app.getUser().getId().equals(currentUser().getId())) {
            throw new IllegalArgumentException("Application not found"); // don't leak that it belongs to another user
        }
        return app;
    }

    public JobApplicationResponse findOne(Long id) {
        return toResponse(findOwnedOrThrow(id));
    }

    private void applyRequest(JobApplication app, JobApplicationRequest request) {
        app.setCompanyName(request.companyName());
        app.setJobTitle(request.jobTitle());
        app.setApplicationDate(request.applicationDate());
        app.setStatus(request.status() != null ? request.status() : ApplicationStatus.APPLIED);
        app.setJobUrl(request.jobUrl());
        app.setNotes(request.notes());
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private JobApplicationResponse toResponse(JobApplication app) {
        return new JobApplicationResponse(
                app.getId(), app.getCompanyName(), app.getJobTitle(),
                app.getApplicationDate(), app.getStatus(), app.getJobUrl(), app.getNotes()
        );
    }
}