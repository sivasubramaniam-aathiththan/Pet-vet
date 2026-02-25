package com.petmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

/**
 * AdoptionPost Entity
 * 
 * Manages pet adoption posts submitted by users
 * 
 * Database Table: adoption_posts
 * Primary Key: postId
 * Foreign Key: userId (references users table)
 * 
 * Features:
 * - Status: PENDING, APPROVED, REJECTED
 * - Users can submit abandoned/found pet details
 * - Admin reviews and approves/rejects posts
 * - Approved posts visible to all users
 */
@Entity
@Table(name = "adoption_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdoptionPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @NotBlank(message = "Pet details are required")
    @Column(name = "pet_details", columnDefinition = "TEXT", nullable = false)
    private String petDetails;

    @NotBlank(message = "Location is required")
    @Column(name = "location", nullable = false)
    private String location;

    @NotBlank(message = "Contact number is required")
    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "pet_image", columnDefinition = "TEXT")
    private String petImage;

    @NotBlank(message = "Status is required")
    @Column(name = "status", nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "pet_type")
    private String petType; // dog, cat, bird, etc.

    @Column(name = "age")
    private String age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Foreign Key relationship with User (submitter)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
