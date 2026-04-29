package com.petcare.backend.repository;

import com.petcare.backend.entity.Appointment;
import com.petcare.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByOwnerId(Long ownerId);
    List<Appointment> findByVetId(Long vetId);
    List<Appointment> findByPetId(Long petId);
    List<Appointment> findByVetIdAndAppointmentDateBetween(Long vetId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByStatus(AppointmentStatus status);
}
