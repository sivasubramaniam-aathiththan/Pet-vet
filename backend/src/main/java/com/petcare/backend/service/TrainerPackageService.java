package com.petcare.backend.service;

import com.petcare.backend.entity.TrainerPackage;
import com.petcare.backend.entity.User;
import com.petcare.backend.repository.TrainerPackageRepository;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerPackageService {

    @Autowired
    private TrainerPackageRepository trainerPackageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TrainerPackage> getAllPackages() {
        return trainerPackageRepository.findAll();
    }

    public List<TrainerPackage> getActivePackages() {
        return trainerPackageRepository.findByIsActiveTrue();
    }

    public List<TrainerPackage> getTrainerPackages(Long trainerId) {
        return trainerPackageRepository.findByTrainerId(trainerId);
    }

    public TrainerPackage createPackage(TrainerPackage trainerPackage) {
        return trainerPackageRepository.save(trainerPackage);
    }

    public TrainerPackage updatePackage(Long id, TrainerPackage updated) {
        TrainerPackage existing = trainerPackageRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPackageName(updated.getPackageName());
            existing.setDescription(updated.getDescription());
            existing.setDuration(updated.getDuration());
            existing.setPrice(updated.getPrice());
            existing.setPetType(updated.getPetType());
            existing.setTrainingType(updated.getTrainingType());
            existing.setMobileNumber(updated.getMobileNumber());
            existing.setIsActive(updated.getIsActive());
            return trainerPackageRepository.save(existing);
        }
        return null;
    }

    public void deletePackage(Long id) {
        trainerPackageRepository.deleteById(id);
    }

    public TrainerPackage toggleStatus(Long id) {
        TrainerPackage existing = trainerPackageRepository.findById(id).orElse(null);
        if (existing != null) {
            boolean current = existing.getIsActive() != null && existing.getIsActive();
            existing.setIsActive(!current);
            return trainerPackageRepository.save(existing);
        }
        return null;
    }

    public List<User> getAllTrainers() {
        return userRepository.findByRole(com.petcare.backend.entity.Role.TRAINER);
    }
}
