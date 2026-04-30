package com.petmanagement.service;

import com.petmanagement.dto.request.MedicationRequest;
import com.petmanagement.dto.response.MedicationResponse;
import com.petmanagement.entity.MedicationReport;
import com.petmanagement.entity.Pet;
import com.petmanagement.entity.Role;
import com.petmanagement.repository.MedicationReportRepository;
import com.petmanagement.repository.PetRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Medication service
 * 
 * Doctor-managed records. Users may view their own reports but not modify.
 */
@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationReportRepository medicationRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public List<MedicationResponse> getByPet(Long petId, Long userId) {
        if (isDoctor(userId)) {
            return medicationRepository.findByPetPetId(petId).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return medicationRepository.findByPetPetId(petId).stream()
                .filter(r -> r.getPet().getUser().getUserId().equals(userId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MedicationResponse> getByUser(Long userId) {
        return medicationRepository.findByPetUserUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicationResponse addReport(MedicationRequest request, Long userId) {
        if (!isDoctor(userId)) {
            throw new RuntimeException("Only doctors may create medication reports");
        }
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        MedicationReport report = MedicationReport.builder()
                .medicationName(request.getMedicationName())
                .dosage(request.getDosage())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .notes(request.getNotes())
                .pet(pet)
                .build();
        report = medicationRepository.save(report);
        return mapToResponse(report);
    }

    @Transactional
    public MedicationResponse updateReport(Long reportId, MedicationRequest request, Long userId) {
        MedicationReport report = medicationRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        if (!isDoctor(userId)) {
            throw new RuntimeException("Only doctors may update medication reports");
        }
        // if doctor changed pet association
        if (request.getPetId() != null &&
                !request.getPetId().equals(report.getPet().getPetId())) {
            Pet newPet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));
            report.setPet(newPet);
        }
        report.setMedicationName(request.getMedicationName());
        report.setDosage(request.getDosage());
        report.setStartDate(request.getStartDate());
        report.setEndDate(request.getEndDate());
        report.setNotes(request.getNotes());
        report = medicationRepository.save(report);
        return mapToResponse(report);
    }

    @Transactional
    public void deleteReport(Long reportId, Long userId) {
        MedicationReport report = medicationRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        if (!isDoctor(userId)) {
            throw new RuntimeException("Only doctors may delete medication reports");
        }
        medicationRepository.delete(report);
    }

    private MedicationResponse mapToResponse(MedicationReport r) {
        return MedicationResponse.builder()
                .reportId(r.getReportId())
                .medicationName(r.getMedicationName())
                .dosage(r.getDosage())
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .notes(r.getNotes())
                .petId(r.getPet().getPetId())
                .petName(r.getPet().getPetName())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    private boolean isDoctor(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() == Role.DOCTOR)
                .orElse(false);
    }
}