package com.petmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Vaccination Entity
 * 
 * Tracks vaccination records for pets
 * 
 * Database Table: vaccinations
 * Primary Key: vaccinationId
 * Foreign Key: petId (references pets table)
 * 
 * Features:
 * - Stores vaccine name and dates
 * - Tracks next vaccination date for alerts
 */
@Entity
@Table(name = "vaccinations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_id")
    private Long vaccinationId;

    @NotBlank(message = "Vaccine name is required")
    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @NotNull(message = "Vaccination date is required")
    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @NotNull(message = "Next vaccination date is required")
    @Column(name = "next_vaccination_date", nullable = false)
    private LocalDate nextVaccinationDate;

    @Column(name = "veterinarian")
    private String veterinarian;

    @Column(name = "clinic_name")
    private String clinicName;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Foreign Key relationship with Pet
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
