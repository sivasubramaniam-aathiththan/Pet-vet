package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Vaccination Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VaccinationResponse {
    private Long vaccinationId;
    private String vaccineName;
    private LocalDate vaccinationDate;
    private LocalDate nextVaccinationDate;
    private String veterinarian;
    private String clinicName;
    private String notes;
    
    // Pet info
    private Long petId;
    private String petName;
    
    // Alert info
    private Boolean isDueSoon;
    private Integer daysUntilDue;
    
    private LocalDateTime createdAt;
}
