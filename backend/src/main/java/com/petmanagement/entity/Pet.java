package com.petmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Pet Entity
 * 
 * Represents pets owned by users
 * 
 * Database Table: pets
 * Primary Key: petId
 * Foreign Key: userId (references users table)
 * 
 * Relationships:
 * - Many-to-One with User: Each pet belongs to one user
 * - One-to-Many with Vaccination: A pet can have multiple vaccinations
 * - One-to-Many with Expense: A pet can have multiple expenses
 * - One-to-Many with Appointment: A pet can have multiple appointments
 */
@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Long petId;

    @NotBlank(message = "Pet name is required")
    @Column(name = "pet_name", nullable = false)
    private String petName;

    @NotNull(message = "Date of birth is required")
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "pet_image", columnDefinition = "TEXT")
    private String petImage;

    @NotBlank(message = "Breed is required")
    @Column(name = "breed", nullable = false)
    private String breed;

    @Column(name = "species")
    private String species;

    @Column(name = "gender")
    private String gender;

    @Column(name = "color")
    private String color;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Foreign Key relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Relationships
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vaccination> vaccinations = new ArrayList<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Expense> expenses = new ArrayList<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();

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
