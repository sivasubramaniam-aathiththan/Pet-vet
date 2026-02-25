package com.petmanagement.service;

import com.petmanagement.dto.request.PetRequest;
import com.petmanagement.dto.response.PetResponse;
import com.petmanagement.entity.Pet;
import com.petmanagement.entity.User;
import com.petmanagement.repository.PetRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Pet Service
 * 
 * Handles CRUD operations for pets
 */
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    // Get all pets for a user
    public List<PetResponse> getPetsByUser(Long userId) {
        return petRepository.findByUserUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get pet by ID
    public PetResponse getPetById(Long petId, Long userId) {
        Pet pet = petRepository.findByPetIdAndUserUserId(petId, userId)
                .orElseThrow(() -> new RuntimeException("Pet not found or access denied"));
        return mapToResponse(pet);
    }

    // Create new pet
    @Transactional
    public PetResponse createPet(PetRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pet pet = Pet.builder()
                .petName(request.getPetName())
                .dateOfBirth(request.getDateOfBirth())
                .petImage(request.getPetImage())
                .breed(request.getBreed())
                .species(request.getSpecies())
                .gender(request.getGender())
                .color(request.getColor())
                .weight(request.getWeight())
                .notes(request.getNotes())
                .user(user)
                .build();

        pet = petRepository.save(pet);
        return mapToResponse(pet);
    }

    // Update pet
    @Transactional
    public PetResponse updatePet(Long petId, PetRequest request, Long userId) {
        Pet pet = petRepository.findByPetIdAndUserUserId(petId, userId)
                .orElseThrow(() -> new RuntimeException("Pet not found or access denied"));

        pet.setPetName(request.getPetName());
        pet.setDateOfBirth(request.getDateOfBirth());
        pet.setPetImage(request.getPetImage());
        pet.setBreed(request.getBreed());
        pet.setSpecies(request.getSpecies());
        pet.setGender(request.getGender());
        pet.setColor(request.getColor());
        pet.setWeight(request.getWeight());
        pet.setNotes(request.getNotes());

        pet = petRepository.save(pet);
        return mapToResponse(pet);
    }

    // Delete pet
    @Transactional
    public void deletePet(Long petId, Long userId) {
        Pet pet = petRepository.findByPetIdAndUserUserId(petId, userId)
                .orElseThrow(() -> new RuntimeException("Pet not found or access denied"));
        petRepository.delete(pet);
    }

    // Get pet count for user
    public long getPetCountByUser(Long userId) {
        return petRepository.countByUserUserId(userId);
    }

    // Map entity to response DTO
    private PetResponse mapToResponse(Pet pet) {
        return PetResponse.builder()
                .petId(pet.getPetId())
                .petName(pet.getPetName())
                .dateOfBirth(pet.getDateOfBirth())
                .petImage(pet.getPetImage())
                .breed(pet.getBreed())
                .species(pet.getSpecies())
                .gender(pet.getGender())
                .color(pet.getColor())
                .weight(pet.getWeight())
                .notes(pet.getNotes())
                .userId(pet.getUser().getUserId())
                .ownerName(pet.getUser().getFirstName() + " " + pet.getUser().getLastName())
                .createdAt(pet.getCreatedAt())
                .build();
    }
}
