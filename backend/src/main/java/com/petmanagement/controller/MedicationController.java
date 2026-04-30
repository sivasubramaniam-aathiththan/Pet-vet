package com.petmanagement.controller;

import com.petmanagement.dto.request.MedicationRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.MedicationResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Medication controller
 * 
 * Only doctors can create/update/delete reports; users may view their own records
 */
@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;
    private final UserRepository userRepository;

    @GetMapping("/pet/{petId}")
    public ResponseEntity<ApiResponse<List<MedicationResponse>>> getByPet(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<MedicationResponse> list = medicationService.getByPet(petId, userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicationResponse>>> getByUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<MedicationResponse> list = medicationService.getByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<MedicationResponse>> addReport(
            @Valid @RequestBody MedicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        MedicationResponse resp = medicationService.addReport(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Report added", resp));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<MedicationResponse>> updateReport(
            @PathVariable Long id,
            @Valid @RequestBody MedicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        MedicationResponse resp = medicationService.updateReport(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Report updated", resp));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        medicationService.deleteReport(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Report deleted"));
    }

    private Long getUserId(UserDetails details) {
        User user = userRepository.findByUsername(details.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + details.getUsername()));
        return user.getUserId();
    }
}
