package com.petmanagement.controller;

import com.petmanagement.dto.request.PetRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.PetResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Pet Controller
 * 
 * Handles CRUD operations for pets
 * Accessible by USER and ADMIN roles
 */
@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;
    private final UserRepository userRepository;

    // Get all pets for current user
    @GetMapping
    public ResponseEntity<ApiResponse<List<PetResponse>>> getUserPets(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<PetResponse> pets = petService.getPetsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(pets));
    }

    // Get pet by ID
    @GetMapping("/{petId}")
    public ResponseEntity<ApiResponse<PetResponse>> getPetById(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        PetResponse pet = petService.getPetById(petId, userId);
        return ResponseEntity.ok(ApiResponse.success(pet));
    }

    // Create new pet
    @PostMapping
    public ResponseEntity<ApiResponse<PetResponse>> createPet(
            @Valid @RequestBody PetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        PetResponse pet = petService.createPet(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Pet created successfully", pet));
    }

    // Update pet
    @PutMapping("/{petId}")
    public ResponseEntity<ApiResponse<PetResponse>> updatePet(
            @PathVariable Long petId,
            @Valid @RequestBody PetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        PetResponse pet = petService.updatePet(petId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Pet updated successfully", pet));
    }

    // Delete pet
    @DeleteMapping("/{petId}")
    public ResponseEntity<ApiResponse<Void>> deletePet(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        petService.deletePet(petId, userId);
        return ResponseEntity.ok(ApiResponse.success("Pet deleted successfully"));
    }

    // Get pet count for user
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getPetCount(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        long count = petService.getPetCountByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
        return user.getUserId();
    }
}
