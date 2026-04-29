package com.petcare.backend.controller;

import com.petcare.backend.entity.Vaccination;
import com.petcare.backend.service.VaccinationService;
import com.petcare.backend.service.VaccinationReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class VaccinationController {

    @Autowired
    private VaccinationService vaccinationService;

    @Autowired
    private VaccinationReminderService reminderService;

    @PostMapping
    public Vaccination addVaccination(@RequestBody Vaccination vaccination) {
        return vaccinationService.addVaccination(vaccination);
    }

    @PostMapping("/trigger-reminders")
    public ResponseEntity<Void> triggerReminders() {
        reminderService.triggerRemindersNow();
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<Vaccination> getAllVaccinations() {
        return vaccinationService.getAllVaccinations();
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
    public List<Vaccination> getVaccinationsByPetId(@PathVariable Long petId) {
        return vaccinationService.getVaccinationsByPetId(petId);
    }

    @GetMapping("/vet/{vetId}")
    public List<Vaccination> getVaccinationsByVetId(@PathVariable Long vetId) {
        return vaccinationService.getVaccinationsByVetId(vetId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id, @RequestBody Vaccination vaccination) {
        Vaccination updated = vaccinationService.updateVaccination(id, vaccination);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        vaccinationService.deleteVaccination(id);
        return ResponseEntity.ok().build();
    }
}
