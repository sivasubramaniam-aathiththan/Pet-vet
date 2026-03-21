package com.petmanagement.controller;

import com.petmanagement.dto.request.AppointmentRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.AppointmentResponse;
import com.petmanagement.dto.response.MedicalHistoryResponse;
import com.petmanagement.dto.response.PetResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Appointment Controller
 * 
 * Handles appointment booking and management
 * Accessible by USER, DOCTOR, and ADMIN roles
 */
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // Get available doctors
    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAvailableDoctors() {
        List<AppointmentResponse> doctors = appointmentService.getAvailableDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // Get user's appointments
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getUserAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // Get doctor's appointments
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getDoctorAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // Get doctor's patients (unique pets from appointments)
    @GetMapping("/doctor/patients")
    public ResponseEntity<ApiResponse<List<PetResponse>>> getDoctorPatients(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        List<PetResponse> patients = appointmentService.getDoctorPatients(doctorId);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    // Get medical history for a pet (vaccinations and medications) - for doctors
    @GetMapping("/doctor/patients/{petId}/medical-history")
    public ResponseEntity<ApiResponse<MedicalHistoryResponse>> getMedicalHistory(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        MedicalHistoryResponse history = appointmentService.getMedicalHistory(petId, doctorId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    // Get upcoming appointments for user
    @GetMapping("/user/upcoming")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getUpcomingUserAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<AppointmentResponse> appointments = appointmentService.getUpcomingAppointmentsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // Get upcoming appointments for doctor
    @GetMapping("/doctor/upcoming")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getUpcomingDoctorAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        List<AppointmentResponse> appointments = appointmentService.getUpcomingAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    // Book appointment
    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        AppointmentResponse appointment = appointmentService.bookAppointment(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Appointment booked successfully", appointment));
    }

    // Update appointment status
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateStatus(
            @PathVariable Long appointmentId,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        AppointmentResponse appointment = appointmentService.updateStatus(appointmentId, status, userId);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated", appointment));
    }

    // Cancel appointment
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        appointmentService.cancelAppointment(appointmentId, userId);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully"));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
        return user.getUserId();
    }
}
