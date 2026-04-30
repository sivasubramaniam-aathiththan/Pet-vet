package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Medical History Response DTO
 * Combined response for vaccination and medication history
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistoryResponse {
    private Long petId;
    private String petName;
    private String ownerName;
    private Long ownerId;
    private List<VaccinationResponse> vaccinations;
    private List<MedicationResponse> medications;
}
