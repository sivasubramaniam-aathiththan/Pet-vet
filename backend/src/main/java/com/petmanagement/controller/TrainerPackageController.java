package com.petmanagement.controller;

import com.petmanagement.dto.request.TrainerPackageRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.TrainerPackageResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.TrainerPackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Trainer Package Controller
 * 
 * Handles training packages
 */
@RestController
@RequestMapping("/api/trainer-packages")
@RequiredArgsConstructor
public class TrainerPackageController {

    private final TrainerPackageService trainerPackageService;
    private final UserRepository userRepository;

    // Get all active packages (public)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TrainerPackageResponse>>> getActivePackages() {
        List<TrainerPackageResponse> packages = trainerPackageService.getActivePackages();
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    // Get trainer's packages
    @GetMapping("/my-packages")
    public ResponseEntity<ApiResponse<List<TrainerPackageResponse>>> getTrainerPackages(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long trainerId = getUserIdFromUserDetails(userDetails);
        List<TrainerPackageResponse> packages = trainerPackageService.getPackagesByTrainer(trainerId);
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    // Get packages by trainer ID
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<ApiResponse<List<TrainerPackageResponse>>> getPackagesByTrainer(
            @PathVariable Long trainerId) {
        List<TrainerPackageResponse> packages = trainerPackageService.getPackagesByTrainer(trainerId);
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    // Add training package (Trainer only)
    @PostMapping
    public ResponseEntity<ApiResponse<TrainerPackageResponse>> addPackage(
            @Valid @RequestBody TrainerPackageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long trainerId = getUserIdFromUserDetails(userDetails);
        TrainerPackageResponse pkg = trainerPackageService.addPackage(request, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Package created successfully", pkg));
    }

    // Update package
    @PutMapping("/{packageId}")
    public ResponseEntity<ApiResponse<TrainerPackageResponse>> updatePackage(
            @PathVariable Long packageId,
            @Valid @RequestBody TrainerPackageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long trainerId = getUserIdFromUserDetails(userDetails);
        TrainerPackageResponse pkg = trainerPackageService.updatePackage(packageId, request, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", pkg));
    }

    // Delete package
    @DeleteMapping("/{packageId}")
    public ResponseEntity<ApiResponse<Void>> deletePackage(
            @PathVariable Long packageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long trainerId = getUserIdFromUserDetails(userDetails);
        trainerPackageService.deletePackage(packageId, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Package deleted successfully"));
    }

    // Toggle package active status
    @PutMapping("/{packageId}/toggle-status")
    public ResponseEntity<ApiResponse<TrainerPackageResponse>> togglePackageStatus(
            @PathVariable Long packageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long trainerId = getUserIdFromUserDetails(userDetails);
        TrainerPackageResponse pkg = trainerPackageService.togglePackageStatus(packageId, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Package status updated", pkg));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
        return user.getUserId();
    }
}
