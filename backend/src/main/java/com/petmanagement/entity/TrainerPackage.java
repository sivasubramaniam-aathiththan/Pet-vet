package com.petmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.time.LocalDateTime;

/**
 * TrainerPackage Entity
 * 
 * Manages training packages offered by trainers
 * 
 * Database Table: trainer_packages
 * Primary Key: packageId
 * Foreign Key: trainerId (references users table with TRAINER role)
 * 
 * Features:
 * - Trainers can add training packages
 * - Includes duration and price
 * - Users can view and contact trainers
 */
@Entity
@Table(name = "trainer_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long packageId;

    @NotBlank(message = "Package name is required")
    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Duration is required")
    @Column(name = "duration", nullable = false)
    private String duration; // e.g., "4 weeks", "1 month"

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "pet_type")
    private String petType; // dog, cat, all, etc.

    @Column(name = "training_type")
    private String trainingType; // obedience, agility, behavioral, etc.

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Foreign Key relationship with Trainer (User with TRAINER role)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;

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
