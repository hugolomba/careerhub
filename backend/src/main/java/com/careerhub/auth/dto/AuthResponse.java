package com.careerhub.auth.dto;

public record AuthResponse(
        String token,
        String fullName,
        String email
) {}
