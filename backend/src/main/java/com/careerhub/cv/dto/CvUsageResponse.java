package com.careerhub.cv.dto;

public record CvUsageResponse(
        Long applicationId,
        String companyName,
        String jobTitle
) {}
