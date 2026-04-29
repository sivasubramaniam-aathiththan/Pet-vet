package com.petcare.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long petId;

    private String petName;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private Long vetId;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    private String reason;

    private String serviceType;

    private Double serviceCost;

    @Column(columnDefinition = "double precision default 0.0")
    private Double clinicFee = 0.0;

    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean paid = false;

    private LocalDateTime updatedAt;
}
