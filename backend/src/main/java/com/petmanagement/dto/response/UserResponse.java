package com.petmanagement.dto.response;

import com.petmanagement.entity.Role;
import lombok.*;
import java.time.LocalDateTime;

/**
 * User Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
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
