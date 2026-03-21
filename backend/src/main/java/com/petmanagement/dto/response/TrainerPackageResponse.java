package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Trainer Package Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerPackageResponse {
    private Long packageId;
    private String packageName;
    private String description;
    private String duration;
    private Double price;
    private String petType;
    private String trainingType;
    private String mobileNumber;
    private Boolean isActive;
    
    // Trainer info
    private Long trainerId;
    private String trainerName;
    private String trainerExpertise;
    private String trainerPhone;
    
    private LocalDateTime createdAt;
}