package com.petcare.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Pet Info
    private Long petId;
    private String petName;

    // Veterinarian who prescribed
    private Long veterinarianId;
    private String veterinarianName;

    // Drug Details
    private String drugName;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;

    // Drug Interaction Alerts
    private String interactionAlerts;

    // Digital Prescription Handling
    private String prescriptionRef;

    @JsonIgnore
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] prescriptionFile;
    private String prescriptionFileName;
    private String prescriptionFileType;

    // Diagnostic Notes & Remarks
    private String diagnosticNote;
    private String remarks;

    // Compliance Monitoring
    private Integer totalDoses;
    private Integer administeredDoses;
}
