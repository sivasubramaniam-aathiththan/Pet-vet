package com.petcare.backend.service;

import com.petcare.backend.entity.Medication;
import com.petcare.backend.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService {

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private DrugInteractionService drugInteractionService;

    public Medication addMedication(Medication medication) {
        try (java.io.PrintWriter out = new java.io.PrintWriter(new java.io.BufferedWriter(new java.io.FileWriter("med_debug.txt", true)))) {
            out.println("DEBUG [" + java.time.LocalDateTime.now() + "]: " + medication);
        } catch (Exception e) {}
        
        System.out.println("DEBUG: Adding medication " + medication.getDrugName() + " with Diagnostic Note: " + medication.getDiagnosticNote());
        System.out.println("DEBUG: Pet ID: " + medication.getPetId());
        
        // Automatically check for interactions with existing treatments for the same pet
        List<Medication> existingMeds = medicationRepository.findByPetId(medication.getPetId());
        System.out.println("DEBUG: Found " + existingMeds.size() + " existing meds for pet " + medication.getPetId());

        for (Medication existing : existingMeds) {
            String warning = drugInteractionService.checkInteraction(medication.getDrugName(), existing.getDrugName());
            if (warning != null) {
                System.out.println("DEBUG: !!! INTERACTION DETECTED !!! " + medication.getDrugName() + " vs " + existing.getDrugName());
                // Set the warning with clear drug reference
                medication.setInteractionAlerts("🚨 Interaction with " + existing.getDrugName() + ": " + warning);
                break; // Alert on first major conflict found
            }
        }
        return medicationRepository.save(medication);
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Medication getMedicationById(Long id) {
        return medicationRepository.findById(id).orElse(null);
    }

    public List<Medication> getMedicationsByPetId(Long petId) {
        return medicationRepository.findByPetId(petId);
    }

    public List<Medication> getMedicationsByVetId(Long vetId) {
        return medicationRepository.findByVeterinarianId(vetId);
    }

    public Medication updateMedication(Long id, Medication medicationDetails) {
        Medication medication = getMedicationById(id);
        if (medication != null) {
            medication.setPetId(medicationDetails.getPetId());
            medication.setPetName(medicationDetails.getPetName());
            medication.setDrugName(medicationDetails.getDrugName());
            medication.setDosage(medicationDetails.getDosage());
            medication.setFrequency(medicationDetails.getFrequency());
            medication.setStartDate(medicationDetails.getStartDate());
            medication.setEndDate(medicationDetails.getEndDate());
            medication.setInteractionAlerts(medicationDetails.getInteractionAlerts());
            medication.setPrescriptionRef(medicationDetails.getPrescriptionRef());
            medication.setDiagnosticNote(medicationDetails.getDiagnosticNote());
            medication.setRemarks(medicationDetails.getRemarks());
            medication.setTotalDoses(medicationDetails.getTotalDoses());
            medication.setAdministeredDoses(medicationDetails.getAdministeredDoses());
            return medicationRepository.save(medication);
        }
        return null;
    }

    public void deleteMedication(Long id) {
        medicationRepository.deleteById(id);
    }
}
