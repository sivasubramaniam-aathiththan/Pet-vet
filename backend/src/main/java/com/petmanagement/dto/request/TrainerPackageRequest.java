package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

/**
 * Trainer Package Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerPackageRequest {
    @NotBlank(message = "Package name is required")
    private String packageName;
    
    private String description;
    
    @NotBlank(message = "Duration is required")
    private String duration;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    private String petType;
    private String trainingType;
}