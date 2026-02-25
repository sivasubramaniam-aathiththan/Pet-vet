package com.petmanagement.dto;

import com.petmanagement.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

/**
 * User DTOs
 * 
 * Contains DTOs for user operations
 */

// User Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class UserResponse {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private Role role;
    private Boolean enabled;
    private String specialization; // For doctors
    private String availability;   // For doctors
    private String expertise;      // For trainers
    private LocalDateTime createdAt;
}

// User Update Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
}

// Create Doctor/Trainer Request DTO (Admin only)
@Data
@NoArgsConstructor
@AllArgsConstructor
class CreateStaffRequest {
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
    
    @NotBlank(message = "Role is required")
    private String role; // DOCTOR or TRAINER
    
    // For Doctor
    private String specialization;
    private String availability;
    
    // For Trainer
    private String expertise;
}

// Change Password Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class ChangePasswordRequest {
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;
}
