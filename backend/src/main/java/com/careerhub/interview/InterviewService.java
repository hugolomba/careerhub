package com.careerhub.interview;

import com.careerhub.application.ApplicationStatus;
import com.careerhub.application.JobApplication;
import com.careerhub.application.JobApplicationRepository;
import com.careerhub.interview.dto.InterviewRequest;
import com.careerhub.interview.dto.InterviewResponse;
import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public InterviewService(InterviewRepository interviewRepository,
                            JobApplicationRepository applicationRepository,
                            UserRepository userRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public List<InterviewResponse> findByApplication(Long applicationId) {
        ownedApplicationOrThrow(applicationId); // makes sure the application belongs to the logged-in user
        return interviewRepository.findByApplicationId(applicationId).stream().map(this::toResponse).toList();
    }

    // Powers the standalone Interviews page (RS section 4.1: "list of all
    // upcoming and past interviews with links to parent applications").
    public List<InterviewResponse> findAllForCurrentUser() {
        return interviewRepository.findByApplication_UserId(currentUser().getId())
                .stream().map(this::toResponse).toList();
    }

    public InterviewResponse create(Long applicationId, InterviewRequest request) {
        JobApplication application = ownedApplicationOrThrow(applicationId);
        Interview interview = new Interview();
        interview.setApplication(application);
        applyRequest(interview, request);
        interviewRepository.save(interview);

        // Scheduling an interview is a clear signal the application moved forward.
        if (application.getStatus() == ApplicationStatus.APPLIED) {
            application.setStatus(ApplicationStatus.INTERVIEWING);
            applicationRepository.save(application);
        }

        return toResponse(interview);
    }

    public InterviewResponse update(Long id, InterviewRequest request) {
        Interview interview = ownedInterviewOrThrow(id);
        applyRequest(interview, request);
        interviewRepository.save(interview);
        return toResponse(interview);
    }

    public void delete(Long id) {
        interviewRepository.delete(ownedInterviewOrThrow(id));
    }

    private void applyRequest(Interview interview, InterviewRequest request) {
        interview.setInterviewDate(request.interviewDate());
        interview.setType(request.type());
        interview.setStage(request.stage());
        interview.setNotes(request.notes());
    }

    private JobApplication ownedApplicationOrThrow(Long applicationId) {
        JobApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        if (!app.getUser().getId().equals(currentUser().getId())) {
            throw new IllegalArgumentException("Application not found");
        }
        return app;
    }

    private Interview ownedInterviewOrThrow(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        if (!interview.getApplication().getUser().getId().equals(currentUser().getId())) {
            throw new IllegalArgumentException("Interview not found");
        }
        return interview;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private InterviewResponse toResponse(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getApplication().getId(),
                interview.getApplication().getCompanyName(),
                interview.getApplication().getJobTitle(),
                interview.getInterviewDate(),
                interview.getType(),
                interview.getStage(),
                interview.getNotes(),
                interview.getInterviewDate().isBefore(LocalDateTime.now())
        );
    }
}