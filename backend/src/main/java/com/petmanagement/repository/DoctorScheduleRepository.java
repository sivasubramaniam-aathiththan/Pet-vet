package com.petmanagement.repository;

import com.petmanagement.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Doctor Schedule Repository
 * 
 * Handles database operations for DoctorSchedule entity
 */
@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    
    // Find all schedules by doctor
    List<DoctorSchedule> findByDoctorUserIdAndIsActiveTrue(Long doctorId);
    
    // Find schedules by doctor and day of week
    List<DoctorSchedule> findByDoctorUserIdAndDayOfWeekAndIsActiveTrue(Long doctorId, Integer dayOfWeek);
    
    // Find schedules by doctor and specific date
    List<DoctorSchedule> findByDoctorUserIdAndSpecificDateAndIsActiveTrue(Long doctorId, LocalDate specificDate);
    
    // Check if doctor is available at specific date and time
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM DoctorSchedule s " +
           "WHERE s.doctor.userId = :doctorId " +
           "AND s.isActive = true " +
           "AND ((s.specificDate = :date AND s.startTime <= :time AND s.endTime > :time) " +
           "OR (s.specificDate IS NULL AND s.dayOfWeek = :dayOfWeek " +
           "AND s.startTime <= :time AND s.endTime > :time))")
    boolean isDoctorAvailableAt(@Param("doctorId") Long doctorId, 
                                @Param("date") LocalDate date,
                                @Param("dayOfWeek") Integer dayOfWeek,
                                @Param("time") LocalTime time);
    
    // Get available time slots for a doctor on a specific date
    @Query("SELECT s FROM DoctorSchedule s " +
           "WHERE s.doctor.userId = :doctorId " +
           "AND s.isActive = true " +
           "AND (s.specificDate = :date OR (s.specificDate IS NULL AND s.dayOfWeek = :dayOfWeek))")
    List<DoctorSchedule> getAvailableSchedulesForDoctorOnDate(@Param("doctorId") Long doctorId,
                                                              @Param("date") LocalDate date,
                                                              @Param("dayOfWeek") Integer dayOfWeek);
    
    // Check if schedule exists for doctor
    boolean existsByDoctorUserIdAndIsActiveTrue(Long doctorId);
}