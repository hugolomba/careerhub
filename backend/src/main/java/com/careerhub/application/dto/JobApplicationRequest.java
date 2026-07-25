package com.careerhub.application.dto;

import com.careerhub.application.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record JobApplicationRequest(
        @NotBlank String companyName,
        @NotBlank String jobTitle,
        @NotNull LocalDate applicationDate,
        ApplicationStatus status, // it can be null -> default APPLIED on service
        String jobUrl,
        String notes
) {}