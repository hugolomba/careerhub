package com.careerhub.interview.dto;

import com.careerhub.interview.InterviewType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record InterviewRequest(
        @NotNull LocalDateTime interviewDate,
        @NotNull InterviewType type,
        String stage,
        String notes
) {}