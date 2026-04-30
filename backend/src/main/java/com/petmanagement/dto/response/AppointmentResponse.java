package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Appointment Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long appointmentId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String reason;
    private String notes;
    
    // Pet info
    private Long petId;
    private String petName;
    
    // Doctor info
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String firstName;
    private String lastName;
    private String specialization;
    private String availability;
    
    // User info
    private Long userId;
    private String userName;
    
    private LocalDateTime createdAt;
}
