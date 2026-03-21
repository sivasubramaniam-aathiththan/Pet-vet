package com.petmanagement.controller;

import com.petmanagement.dto.request.VaccinationRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.VaccinationResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.VaccinationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Vaccination Controller
 * 
 * Handles vaccination records and alerts
 * Accessible by USER and ADMIN roles
 */
@RestController
@RequestMapping("/api/vaccinations")
@RequiredArgsConstructor
public class VaccinationController {

    private final VaccinationService vaccinationService;
    private final UserRepository userRepository;

    // Get vaccinations by pet
    @GetMapping("/pet/{petId}")
    public ResponseEntity<ApiResponse<List<VaccinationResponse>>> getVaccinationsByPet(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsByPet(petId, userId);
        return ResponseEntity.ok(ApiResponse.success(vaccinations));
    }

    // Get all vaccinations for user
    @GetMapping
    public ResponseEntity<ApiResponse<List<VaccinationResponse>>> getUserVaccinations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(vaccinations));
    }

    // Get all vaccinations for doctor's patients (from their appointments)
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<List<VaccinationResponse>>> getDoctorPatientVaccinations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long doctorId = getUserIdFromUserDetails(userDetails);
        List<VaccinationResponse> vaccinations = vaccinationService.getDoctorPatientVaccinations(doctorId);
        return ResponseEntity.ok(ApiResponse.success(vaccinations));
    }

    // Get vaccinations due soon
    @GetMapping("/due-soon")
    public ResponseEntity<ApiResponse<List<VaccinationResponse>>> getVaccinationsDueSoon(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsDueSoon(userId);
        return ResponseEntity.ok(ApiResponse.success(vaccinations));
    }

    // Get overdue vaccinations
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<VaccinationResponse>>> getOverdueVaccinations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<VaccinationResponse> vaccinations = vaccinationService.getOverdueVaccinations(userId);
        return ResponseEntity.ok(ApiResponse.success(vaccinations));
    }

    // Add vaccination (doctor only)
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<VaccinationResponse>> addVaccination(
            @Valid @RequestBody VaccinationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        VaccinationResponse vaccination = vaccinationService.addVaccination(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Vaccination added successfully", vaccination));
    }

    // Update vaccination (doctor only)
    @PutMapping("/{vaccinationId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<VaccinationResponse>> updateVaccination(
            @PathVariable Long vaccinationId,
            @Valid @RequestBody VaccinationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        VaccinationResponse vaccination = vaccinationService.updateVaccination(vaccinationId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Vaccination updated successfully", vaccination));
    }

    // Delete vaccination (doctor only)
    @DeleteMapping("/{vaccinationId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> deleteVaccination(
            @PathVariable Long vaccinationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        vaccinationService.deleteVaccination(vaccinationId, userId);
        return ResponseEntity.ok(ApiResponse.success("Vaccination deleted successfully"));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
        return user.getUserId();
    }
}
