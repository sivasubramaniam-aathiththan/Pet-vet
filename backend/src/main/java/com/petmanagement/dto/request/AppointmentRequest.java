package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Appointment Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;
    
    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;
    
    @NotNull(message = "Pet ID is required")
    private Long petId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    private String reason;
    private String notes;
}
