package com.petcare.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainer_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String packageName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String duration; // e.g., "4 weeks", "1 month"

    @Column(nullable = false)
    private Double price;

    private String petType; // dog, cat, all, etc.
    private String trainingType; // obedience, agility, behavioral, etc.
    private String mobileNumber;

    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;

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
