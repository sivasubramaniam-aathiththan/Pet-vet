package com.petmanagement.controller;

import com.petmanagement.dto.request.DoctorScheduleRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.DoctorScheduleResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.DoctorScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Doctor Schedule Controller
 * 
 * Handles doctor schedule management
 * Accessible by DOCTOR and ADMIN roles
 */
@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class DoctorScheduleController {

    private final DoctorScheduleService scheduleService;
    private final UserRepository userRepository;

    // Create schedule for logged-in doctor
    @PostMapping
    public ResponseEntity<ApiResponse<DoctorScheduleResponse>> createSchedule(
            @Valid @RequestBody DoctorScheduleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        DoctorScheduleResponse schedule = scheduleService.createSchedule(request, doctorId);
        return ResponseEntity.ok(ApiResponse.success("Schedule created successfully", schedule));
    }

    // Get all schedules for logged-in doctor
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorScheduleResponse>>> getMySchedules(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        List<DoctorScheduleResponse> schedules = scheduleService.getDoctorSchedules(doctorId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    // Get schedules for doctor on specific date
    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<ApiResponse<List<DoctorScheduleResponse>>> getSchedulesForDate(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date) {
        List<DoctorScheduleResponse> schedules = scheduleService.getDoctorSchedulesForDate(doctorId, date);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    // Get schedules for a specific doctor (for patients to see available times)
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<DoctorScheduleResponse>>> getDoctorSchedules(
            @PathVariable Long doctorId) {
        List<DoctorScheduleResponse> schedules = scheduleService.getDoctorSchedules(doctorId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    // Update schedule
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<DoctorScheduleResponse>> updateSchedule(
            @PathVariable Long scheduleId,
            @Valid @RequestBody DoctorScheduleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        DoctorScheduleResponse schedule = scheduleService.updateSchedule(scheduleId, request, doctorId);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", schedule));
    }

    // Delete schedule
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @PathVariable Long scheduleId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        scheduleService.deleteSchedule(scheduleId, doctorId);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully"));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
        return user.getUserId();
    }
}