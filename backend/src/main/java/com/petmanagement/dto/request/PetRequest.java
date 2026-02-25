package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

/**
 * Pet Request DTO
 * Used for creating and updating pets
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetRequest {
    @NotBlank(message = "Pet name is required")
    private String petName;
    
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    
    private String petImage;
    
    @NotBlank(message = "Breed is required")
    private String breed;
    
    private String species;
    private String gender;
    private String color;
    private Double weight;
    private String notes;
}
