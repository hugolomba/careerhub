package com.careerhub.cv.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CvResponse(
        Long id,
        String fileName,
        String label,
        List<CvUsageResponse> usedInApplications,
        LocalDateTime uploadedAt
) {}