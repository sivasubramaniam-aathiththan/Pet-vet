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
    private String petId;
    private String petName;

    private String drugName;
    private String dosage; // e.g., "1 Tablet", "5 ml"
    private String frequency; // e.g., "Twice a day", "Daily"

    private LocalDate startDate;
    private LocalDate endDate;

    // Drug Interaction Alerts
    private String interactionAlerts; // Manual safety warnings

    // Digital Prescription Handling
    private String prescriptionRef; // Prescription note or document link

    @JsonIgnore
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] prescriptionFile;
    private String prescriptionFileName;
    private String prescriptionFileType;

    // Compliance Monitoring
    private Integer totalDoses;
    private Integer administeredDoses; // To calculate compliance percentage
}
