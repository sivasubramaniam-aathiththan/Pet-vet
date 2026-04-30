package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Adoption Post Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionPostRequest {
    @NotBlank(message = "Pet details are required")
    private String petDetails;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Contact number is required")
    private String contactNumber;
    
    private String petImage;
    private String petType;
    private String age;
    private String gender;
    private String description;
}