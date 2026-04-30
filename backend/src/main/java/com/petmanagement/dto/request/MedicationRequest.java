package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicationRequest {
    @NotNull(message = "Pet ID is required")
    private Long petId;

    @NotBlank(message = "Medication name is required")
    private String medicationName;

    private String dosage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
}