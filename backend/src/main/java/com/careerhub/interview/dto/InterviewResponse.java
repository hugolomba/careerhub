package com.careerhub.interview.dto;

import com.careerhub.interview.InterviewType;

import java.time.LocalDateTime;

public record InterviewResponse(
        Long id,
        Long applicationId,
        String companyName,
        String jobTitle,
        LocalDateTime interviewDate,
        InterviewType type,
        String stage,
        String notes,
        boolean pastDate // true if interviewDate already passed -> E1 from PRS (warning, but saves anyways)
) {}