package com.petmanagement.service;

import com.petmanagement.dto.request.DoctorScheduleRequest;
import com.petmanagement.dto.response.DoctorScheduleResponse;
import com.petmanagement.entity.DoctorSchedule;
import com.petmanagement.entity.User;
import com.petmanagement.repository.DoctorScheduleRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Doctor Schedule Service
 * 
 * Handles doctor schedule management
 */
@Service
@RequiredArgsConstructor
public class DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    // Create schedule for doctor
    @Transactional
    public DoctorScheduleResponse createSchedule(DoctorScheduleRequest request, Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Validate time range
        if (request.getEndTime().isBefore(request.getStartTime()) || 
            request.getEndTime().equals(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        // Check for overlapping schedules on same day
        List<DoctorSchedule> existingSchedules = scheduleRepository
                .findByDoctorUserIdAndDayOfWeekAndIsActiveTrue(doctorId, request.getDayOfWeek());
        
        for (DoctorSchedule existing : existingSchedules) {
            if (timesOverlap(request.getStartTime(), request.getEndTime(), 
                           existing.getStartTime(), existing.getEndTime())) {
                throw new RuntimeException("Schedule overlaps with existing schedule");
            }
        }

        DoctorSchedule schedule = DoctorSchedule.builder()
                .doctor(doctor)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .specificDate(request.getSpecificDate())
                .isActive(true)
                .build();

        schedule = scheduleRepository.save(schedule);
        return mapToResponse(schedule);
    }

    // Get doctor's all schedules
    public List<DoctorScheduleResponse> getDoctorSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorUserIdAndIsActiveTrue(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get schedules for doctor on specific date
    public List<DoctorScheduleResponse> getDoctorSchedulesForDate(Long doctorId, LocalDate date) {
        int dayOfWeek = date.getDayOfWeek().getValue(); // 1=Monday, 7=Sunday
        
        List<DoctorSchedule> schedules = scheduleRepository
                .getAvailableSchedulesForDoctorOnDate(doctorId, date, dayOfWeek);
        
        return schedules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Check if doctor is available at specific date and time
    public boolean isDoctorAvailableAt(Long doctorId, LocalDate date, LocalTime time) {
        // First check specific date schedules
        List<DoctorSchedule> specificDateSchedules = scheduleRepository
                .findByDoctorUserIdAndSpecificDateAndIsActiveTrue(doctorId, date);
        
        for (DoctorSchedule schedule : specificDateSchedules) {
            if (timeIsWithinRange(time, schedule.getStartTime(), schedule.getEndTime())) {
                return true;
            }
        }

        // Then check day-of-week schedules
        int dayOfWeek = date.getDayOfWeek().getValue();
        List<DoctorSchedule> daySchedules = scheduleRepository
                .findByDoctorUserIdAndDayOfWeekAndIsActiveTrue(doctorId, dayOfWeek);
        
        for (DoctorSchedule schedule : daySchedules) {
            if (timeIsWithinRange(time, schedule.getStartTime(), schedule.getEndTime())) {
                return true;
            }
        }

        return false;
    }

    // Update schedule
    @Transactional
    public DoctorScheduleResponse updateSchedule(Long scheduleId, DoctorScheduleRequest request, Long doctorId) {
        DoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!schedule.getDoctor().getUserId().equals(doctorId)) {
            throw new RuntimeException("Access denied");
        }

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setSpecificDate(request.getSpecificDate());

        schedule = scheduleRepository.save(schedule);
        return mapToResponse(schedule);
    }

    // Delete/deactivate schedule
    @Transactional
    public void deleteSchedule(Long scheduleId, Long doctorId) {
        DoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!schedule.getDoctor().getUserId().equals(doctorId)) {
            throw new RuntimeException("Access denied");
        }

        schedule.setIsActive(false);
        scheduleRepository.save(schedule);
    }

    // Check if doctor has any schedules
    public boolean doctorHasSchedules(Long doctorId) {
        return scheduleRepository.existsByDoctorUserIdAndIsActiveTrue(doctorId);
    }

    // Helper method to check time overlap
    private boolean timesOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    // Helper method to check if time is within range
    private boolean timeIsWithinRange(LocalTime time, LocalTime start, LocalTime end) {
        return !time.isBefore(start) && time.isBefore(end);
    }

    // Map entity to response DTO
    private DoctorScheduleResponse mapToResponse(DoctorSchedule schedule) {
        String dayName = getDayName(schedule.getDayOfWeek());
        
        return DoctorScheduleResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .doctorId(schedule.getDoctor().getUserId())
                .doctorName(schedule.getDoctor().getFirstName() + " " + schedule.getDoctor().getLastName())
                .dayOfWeek(schedule.getDayOfWeek())
                .dayName(dayName)
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .specificDate(schedule.getSpecificDate())
                .isActive(schedule.getIsActive())
                .build();
    }

    // Get day name from day number
    private String getDayName(Integer dayOfWeek) {
        return switch (dayOfWeek) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6 -> "Saturday";
            case 7 -> "Sunday";
            default -> "Unknown";
        };
    }
}