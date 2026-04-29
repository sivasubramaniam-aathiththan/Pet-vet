package com.petcare.backend.controller;

import com.petcare.backend.entity.Medication;
import com.petcare.backend.service.MedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class MedicationController {

    @Autowired
    private MedicationService medicationService;

    @PostMapping
    public Medication addMedication(@RequestBody Medication medication) {
        return medicationService.addMedication(medication);
    }

    @GetMapping
    public List<Medication> getAllMedications() {
        return medicationService.getAllMedications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medication> getMedicationById(@PathVariable Long id) {
        Medication medication = medicationService.getMedicationById(id);
        if (medication != null) {
            return ResponseEntity.ok(medication);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{petId}")
    public List<Medication> getMedicationsByPetId(@PathVariable Long petId) {
        return medicationService.getMedicationsByPetId(petId);
    }

    @GetMapping("/vet/{vetId}")
    public List<Medication> getMedicationsByVetId(@PathVariable Long vetId) {
        return medicationService.getMedicationsByVetId(vetId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(@PathVariable Long id, @RequestBody Medication medication) {
        Medication updated = medicationService.updateMedication(id, medication);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadPrescriptionFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Medication medication = medicationService.getMedicationById(id);
            if (medication != null && !file.isEmpty()) {
                medication.setPrescriptionFile(file.getBytes());
                medication.setPrescriptionFileName(file.getOriginalFilename());
                medication.setPrescriptionFileType(file.getContentType());
                medicationService.addMedication(medication);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadPrescriptionFile(@PathVariable Long id) {
        Medication medication = medicationService.getMedicationById(id);
        if (medication != null && medication.getPrescriptionFile() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + medication.getPrescriptionFileName() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE,
                            medication.getPrescriptionFileType() != null ? medication.getPrescriptionFileType()
                                    : MediaType.APPLICATION_OCTET_STREAM_VALUE)
                    .body(medication.getPrescriptionFile());
        }
        return ResponseEntity.notFound().build();
    }
}
