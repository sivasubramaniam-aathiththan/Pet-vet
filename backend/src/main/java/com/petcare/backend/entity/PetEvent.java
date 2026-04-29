package com.petcare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pet_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // e.g. Exhibition, Clinic, Meetup
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime eventDate;
    private Integer capacity;
    private Integer joinedCount = 0;
    private String organizerName;
}
