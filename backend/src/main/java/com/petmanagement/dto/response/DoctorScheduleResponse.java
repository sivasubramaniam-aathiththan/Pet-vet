package com.petmanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Doctor Schedule Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorScheduleResponse {
    
    private Long scheduleId;
    private Long doctorId;
    private String doctorName;
    private Integer dayOfWeek;
    private String dayName;
    
    @JsonFormat(pattern = "HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalTime startTime;
    
    @JsonFormat(pattern = "HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalTime endTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate specificDate;
    
    private Boolean isActive;
}