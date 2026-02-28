package com.petcare.backend.controller;

import com.petcare.backend.entity.Vaccination;
import com.petcare.backend.service.VaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin(origins = "http://localhost:3000")
public class VaccinationController {
    @Autowired
    private VaccinationService vaccinationService;

    @PostMapping
    public ResponseEntity<Vaccination> addVaccination(@RequestBody Vaccination vaccination) {
        return ResponseEntity.ok(vaccinationService.addVaccination(vaccination));
    }

    @GetMapping
    public ResponseEntity<List<Vaccination>> getAllVaccinations() {
        return ResponseEntity.ok(vaccinationService.getAllVaccinations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaccination> getVaccinationById(@PathVariable Long id) {
        Vaccination vaccination = vaccinationService.getVaccinationById(id);
        if (vaccination != null) {
            return ResponseEntity.ok(vaccination);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<Vaccination>> getVaccinationsByPetId(@PathVariable String petId) {
        return ResponseEntity.ok(vaccinationService.getVaccinationsByPetId(petId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id,
            @RequestBody Vaccination vaccinationDetails) {
        Vaccination updatedVaccination = vaccinationService.updateVaccination(id, vaccinationDetails);
        if (updatedVaccination != null) {
            return ResponseEntity.ok(updatedVaccination);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        vaccinationService.deleteVaccination(id);
        return ResponseEntity.ok().build();
    }
}
