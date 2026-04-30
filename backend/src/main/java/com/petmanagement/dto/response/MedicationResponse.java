package com.petmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MedicationResponse {
    private Long reportId;
    private String medicationName;
    private String dosage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private Long petId;
    private String petName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}