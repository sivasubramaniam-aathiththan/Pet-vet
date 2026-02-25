package com.petmanagement.service;

import com.petmanagement.dto.request.VaccinationRequest;
import com.petmanagement.dto.response.VaccinationResponse;
import com.petmanagement.entity.Pet;
import com.petmanagement.entity.Vaccination;
import com.petmanagement.repository.PetRepository;
import com.petmanagement.repository.VaccinationRepository;
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

    // Get vaccinations by pet
    public List<VaccinationResponse> getVaccinationsByPet(Long petId, Long userId) {
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
        Pet pet = petRepository.findByPetIdAndUserUserId(request.getPetId(), userId)
                .orElseThrow(() -> new RuntimeException("Pet not found or access denied"));

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

        if (!vaccination.getPet().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
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

        if (!vaccination.getPet().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
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
}
