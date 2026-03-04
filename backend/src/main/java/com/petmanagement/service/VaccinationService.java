package com.petmanagement.service;

import com.petmanagement.dto.request.VaccinationRequest;
import com.petmanagement.dto.response.VaccinationResponse;
import com.petmanagement.entity.Pet;
import com.petmanagement.entity.Vaccination;
import com.petmanagement.repository.PetRepository;
import com.petmanagement.repository.VaccinationRepository;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Vaccination Service
 * 
 * Handles vaccination records and alerts
 */
@Service
@RequiredArgsConstructor
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository; // added for role checks

    // Get vaccinations by pet
    public List<VaccinationResponse> getVaccinationsByPet(Long petId, Long userId) {
        if (isDoctor(userId)) {
            // doctor can view records for any pet
            return vaccinationRepository.findByPetPetId(petId).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        return vaccinationRepository.findByPetIdAndUserId(petId, userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all vaccinations for user
    public List<VaccinationResponse> getVaccinationsByUser(Long userId) {
        return vaccinationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get vaccinations due soon (within 7 days)
    public List<VaccinationResponse> getVaccinationsDueSoon(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(7);
        return vaccinationRepository.findVaccinationsDueSoon(today, futureDate).stream()
                .filter(v -> v.getPet().getUser().getUserId().equals(userId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get overdue vaccinations
    public List<VaccinationResponse> getOverdueVaccinations(Long userId) {
        return vaccinationRepository.findOverdueVaccinations(LocalDate.now()).stream()
                .filter(v -> v.getPet().getUser().getUserId().equals(userId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add vaccination record
    @Transactional
    public VaccinationResponse addVaccination(VaccinationRequest request, Long userId) {
        // only doctors may create records; regular users cannot
        if (!isDoctor(userId)) {
            throw new RuntimeException("Only doctors are allowed to create vaccination records");
        }

        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        Vaccination vaccination = Vaccination.builder()
                .vaccineName(request.getVaccineName())
                .vaccinationDate(request.getVaccinationDate())
                .nextVaccinationDate(request.getNextVaccinationDate())
                .veterinarian(request.getVeterinarian())
                .clinicName(request.getClinicName())
                .notes(request.getNotes())
                .pet(pet)
                .build();

        vaccination = vaccinationRepository.save(vaccination);
        return mapToResponse(vaccination);
    }

    // Update vaccination
    @Transactional
    public VaccinationResponse updateVaccination(Long vaccinationId, VaccinationRequest request, Long userId) {
        Vaccination vaccination = vaccinationRepository.findById(vaccinationId)
                .orElseThrow(() -> new RuntimeException("Vaccination not found"));

        // doctors may update any record; regular users may only update their own
        if (!isDoctor(userId)) {
            if (!vaccination.getPet().getUser().getUserId().equals(userId)) {
                throw new RuntimeException("Access denied");
            }
        }

        // if doctor changed the petId we should reassign
        if (isDoctor(userId) && request.getPetId() != null &&
                !request.getPetId().equals(vaccination.getPet().getPetId())) {
            Pet newPet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));
            vaccination.setPet(newPet);
        }

        vaccination.setVaccineName(request.getVaccineName());
        vaccination.setVaccinationDate(request.getVaccinationDate());
        vaccination.setNextVaccinationDate(request.getNextVaccinationDate());
        vaccination.setVeterinarian(request.getVeterinarian());
        vaccination.setClinicName(request.getClinicName());
        vaccination.setNotes(request.getNotes());

        vaccination = vaccinationRepository.save(vaccination);
        return mapToResponse(vaccination);
    }

    // Delete vaccination
    @Transactional
    public void deleteVaccination(Long vaccinationId, Long userId) {
        Vaccination vaccination = vaccinationRepository.findById(vaccinationId)
                .orElseThrow(() -> new RuntimeException("Vaccination not found"));

        if (!isDoctor(userId)) {
            if (!vaccination.getPet().getUser().getUserId().equals(userId)) {
                throw new RuntimeException("Access denied");
            }
        }

        vaccinationRepository.delete(vaccination);
    }

    // Map entity to response DTO
    private VaccinationResponse mapToResponse(Vaccination vaccination) {
        LocalDate today = LocalDate.now();
        long daysUntilDue = ChronoUnit.DAYS.between(today, vaccination.getNextVaccinationDate());
        
        return VaccinationResponse.builder()
                .vaccinationId(vaccination.getVaccinationId())
                .vaccineName(vaccination.getVaccineName())
                .vaccinationDate(vaccination.getVaccinationDate())
                .nextVaccinationDate(vaccination.getNextVaccinationDate())
                .veterinarian(vaccination.getVeterinarian())
                .clinicName(vaccination.getClinicName())
                .notes(vaccination.getNotes())
                .petId(vaccination.getPet().getPetId())
                .petName(vaccination.getPet().getPetName())
                .isDueSoon(daysUntilDue <= 7 && daysUntilDue >= 0)
                .daysUntilDue((int) daysUntilDue)
                .createdAt(vaccination.getCreatedAt())
                .build();
    }

    // helper to check whether the user has doctor role
    private boolean isDoctor(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() == Role.DOCTOR)
                .orElse(false);
    }
}
