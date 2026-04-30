package com.petmanagement.repository;

import com.petmanagement.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Appointment Repository
 * 
 * Handles database operations for Appointment entity
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Find all appointments by user
    @Query("SELECT a FROM Appointment a WHERE a.user.userId = :userId")
    List<Appointment> findByUserId(@Param("userId") Long userId);
    
    // Find all appointments by doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.userId = :doctorId")
    List<Appointment> findByDoctorId(@Param("doctorId") Long doctorId);
    
    // Find appointments by pet
    List<Appointment> findByPetPetId(Long petId);
    
    // Find appointments by status
    List<Appointment> findByStatus(String status);
    
    // Find appointments by date
    List<Appointment> findByAppointmentDate(LocalDate date);
    
    // Find appointments by doctor and date
    List<Appointment> findByDoctorUserIdAndAppointmentDate(Long doctorId, LocalDate date);
    
    // Find appointments by user and status
    @Query("SELECT a FROM Appointment a WHERE a.user.userId = :userId AND a.status = :status")
    List<Appointment> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    // Find appointments by doctor and status
    @Query("SELECT a FROM Appointment a WHERE a.doctor.userId = :doctorId AND a.status = :status")
    List<Appointment> findByDoctorIdAndStatus(@Param("doctorId") Long doctorId, @Param("status") String status);
    
    // Check if doctor has appointment at specific time
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.userId = :doctorId AND a.appointmentDate = :date AND a.appointmentTime = :time AND a.status NOT IN ('CANCELLED')")
    boolean existsByDoctorAndDateAndTime(@Param("doctorId") Long doctorId, @Param("date") LocalDate date, @Param("time") java.time.LocalTime time);
    
    // Count appointments by status
    long countByStatus(String status);
    
    // Get upcoming appointments for user
    @Query("SELECT a FROM Appointment a WHERE a.user.userId = :userId AND a.appointmentDate >= :today ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingAppointmentsByUser(@Param("userId") Long userId, @Param("today") LocalDate today);
    
    // Get upcoming appointments for doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.userId = :doctorId AND a.appointmentDate >= :today ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingAppointmentsByDoctor(@Param("doctorId") Long doctorId, @Param("today") LocalDate today);
}
