package com.careerhub.application.dto;

import com.careerhub.application.ApplicationStatus;

import java.time.LocalDate;

public record JobApplicationResponse(
        Long id,
        String companyName,
        String jobTitle,
        LocalDate applicationDate,
        ApplicationStatus status,
        String jobUrl,
        String notes,
        Long cvId,
        String cvFileName,
        String cvLabel
) {}