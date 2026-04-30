package com.petmanagement.dto.response;

import lombok.*;

/**
 * Login Response DTO
 * Contains JWT tokens and user info
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}
