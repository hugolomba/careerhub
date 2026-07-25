package com.careerhub.cv.dto;

import java.time.LocalDateTime;

public record CvResponse(
        Long id,
        String fileName,
        String label,
        Long applicationId,
        LocalDateTime uploadedAt
) {}