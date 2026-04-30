package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Doctor Schedule Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorScheduleRequest {
    
    @NotNull(message = "Day of week is required (1=Monday, 7=Sunday)")
    private Integer dayOfWeek;
    
    @NotNull(message = "Start time is required")
    @JsonFormat(pattern = "HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    @JsonFormat(pattern = "HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalTime endTime;
    
    // Optional: specific date for special schedules
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate specificDate;
}