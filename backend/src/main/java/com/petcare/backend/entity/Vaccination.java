package com.petcare.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long petId;
    private String petName;
    
    // Veterinarian who administered
    private Long veterinarianId;
    private String veterinarianName;
    
    private String vaccineName;
    private LocalDate dateGiven;
    private LocalDate nextDueDate;
    private String remarks;
}
