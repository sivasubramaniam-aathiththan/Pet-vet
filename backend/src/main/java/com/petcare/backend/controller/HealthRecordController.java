package com.petcare.backend.controller;

import com.petcare.backend.entity.Medication;
import com.petcare.backend.entity.Vaccination;
import com.petcare.backend.service.MedicationService;
import com.petcare.backend.service.VaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-records")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class HealthRecordController {

    @Autowired
    private VaccinationService vaccinationService;

    @Autowired
    private MedicationService medicationService;

    /**
     * Returns combined health records (vaccinations + medications) for a given pet.
     * Used by both Owner and Vet to view full patient history.
     */
    @GetMapping("/pet/{petId}")
    public Map<String, Object> getHealthRecordsByPet(@PathVariable Long petId) {
        List<Vaccination> vaccinations = vaccinationService.getVaccinationsByPetId(petId);
        List<Medication> medications = medicationService.getMedicationsByPetId(petId);

        Map<String, Object> result = new HashMap<>();
        result.put("vaccinations", vaccinations);
        result.put("medications", medications);
        return result;
    }
}
