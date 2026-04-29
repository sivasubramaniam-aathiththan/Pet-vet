package com.petcare.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String species; // Dog, Cat, Bird, etc.

    private String breed;

    private LocalDate dateOfBirth;

    private String gender;

    private Double weight;

    private String color;

    @Column(nullable = false)
    private Long ownerId; // Reference to User ID (Owner)

    @Lob
    private byte[] photo;

    private LocalDate createdAt = LocalDate.now();

    // Medical information
    private String allergies;
    private String specialNeeds;
    private String behavioralTraits;
}
