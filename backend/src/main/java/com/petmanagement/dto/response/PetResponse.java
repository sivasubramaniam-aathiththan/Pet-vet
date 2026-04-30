package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Pet Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponse {
    private Long petId;
    private String petName;
    private LocalDate dateOfBirth;
    private String petImage;
    private String breed;
    private String species;
    private String gender;
    private String color;
    private Double weight;
    private String notes;
    private Long userId;
    private String ownerName;
    private LocalDateTime createdAt;
}
