package com.petcare.backend.controller;

import com.petcare.backend.entity.TrainerPackage;
import com.petcare.backend.entity.User;
import com.petcare.backend.service.TrainerPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training/packages")
@CrossOrigin(origins = "*")
public class TrainerPackageController {

    @Autowired
    private TrainerPackageService trainerPackageService;

    @GetMapping
    public List<TrainerPackage> getAllPackages() {
        return trainerPackageService.getAllPackages();
    }

    @GetMapping("/active")
    public List<TrainerPackage> getActivePackages() {
        return trainerPackageService.getActivePackages();
    }

    @GetMapping("/trainer/{trainerId}")
    public List<TrainerPackage> getTrainerPackages(@PathVariable Long trainerId) {
        return trainerPackageService.getTrainerPackages(trainerId);
    }

    @PostMapping
    public TrainerPackage createPackage(@RequestBody TrainerPackage trainerPackage) {
        return trainerPackageService.createPackage(trainerPackage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerPackage> updatePackage(@PathVariable Long id, @RequestBody TrainerPackage updated) {
        TrainerPackage result = trainerPackageService.updatePackage(id, updated);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        trainerPackageService.deletePackage(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<TrainerPackage> toggleStatus(@PathVariable Long id) {
        TrainerPackage result = trainerPackageService.toggleStatus(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/trainers")
    public List<User> getAllTrainers() {
        return trainerPackageService.getAllTrainers();
    }
}
