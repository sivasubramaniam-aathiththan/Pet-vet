package com.petmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Authentication DTOs
 * 
 * Contains DTOs for login, register, and token operations
 */

// Login Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class LoginRequest {
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
}

// Login Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class LoginResponse {
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

// Register Request DTO (for USER role only)
@Data
@NoArgsConstructor
@AllArgsConstructor
class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    private String phoneNumber;
    private String address;
}

// Refresh Token Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class RefreshTokenRequest {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}

// Token Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}
