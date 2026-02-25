package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

/**
 * Vaccination Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRequest {
    @NotBlank(message = "Vaccine name is required")
    private String vaccineName;
    
    @NotNull(message = "Vaccination date is required")
    private LocalDate vaccinationDate;
    
    @NotNull(message = "Next vaccination date is required")
    private LocalDate nextVaccinationDate;
    
    @NotNull(message = "Pet ID is required")
    private Long petId;
    
    private String veterinarian;
    private String clinicName;
    private String notes;
}
