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

    public Medication addMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Medication getMedicationById(Long id) {
        return medicationRepository.findById(id).orElse(null);
    }

    public List<Medication> getMedicationsByPetId(String petId) {
        return medicationRepository.findByPetId(petId);
    }

    public Medication updateMedication(Long id, Medication details) {
        Medication medication = getMedicationById(id);
        if (medication != null) {
            medication.setPetName(details.getPetName());
            medication.setDrugName(details.getDrugName());
            medication.setDosage(details.getDosage());
            medication.setFrequency(details.getFrequency());
            medication.setStartDate(details.getStartDate());
            medication.setEndDate(details.getEndDate());
            medication.setInteractionAlerts(details.getInteractionAlerts());
            medication.setPrescriptionRef(details.getPrescriptionRef());
            medication.setTotalDoses(details.getTotalDoses());
            medication.setAdministeredDoses(details.getAdministeredDoses());
            return medicationRepository.save(medication);
        }
        return null;
    }

    public void deleteMedication(Long id) {
        medicationRepository.deleteById(id);
    }
}
