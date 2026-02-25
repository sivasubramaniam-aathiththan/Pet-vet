package com.petmanagement.service;

import com.petmanagement.dto.request.TrainerPackageRequest;
import com.petmanagement.dto.response.TrainerPackageResponse;
import com.petmanagement.entity.TrainerPackage;
import com.petmanagement.entity.User;
import com.petmanagement.repository.TrainerPackageRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Trainer Package Service
 * 
 * Handles training packages offered by trainers
 */
@Service
@RequiredArgsConstructor
public class TrainerPackageService {

    private final TrainerPackageRepository trainerPackageRepository;
    private final UserRepository userRepository;

    // Get all active packages (public)
    public List<TrainerPackageResponse> getActivePackages() {
        return trainerPackageRepository.findAllActivePackages().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get packages by trainer
    public List<TrainerPackageResponse> getPackagesByTrainer(Long trainerId) {
        return trainerPackageRepository.findByTrainerId(trainerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add training package (Trainer only)
    @Transactional
    public TrainerPackageResponse addPackage(TrainerPackageRequest request, Long trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        TrainerPackage pkg = TrainerPackage.builder()
                .packageName(request.getPackageName())
                .description(request.getDescription())
                .duration(request.getDuration())
                .price(request.getPrice())
                .petType(request.getPetType())
                .trainingType(request.getTrainingType())
                .isActive(true)
                .trainer(trainer)
                .build();

        pkg = trainerPackageRepository.save(pkg);
        return mapToResponse(pkg);
    }

    // Update package
    @Transactional
    public TrainerPackageResponse updatePackage(Long packageId, TrainerPackageRequest request, Long trainerId) {
        TrainerPackage pkg = trainerPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (!pkg.getTrainer().getUserId().equals(trainerId)) {
            throw new RuntimeException("Access denied");
        }

        pkg.setPackageName(request.getPackageName());
        pkg.setDescription(request.getDescription());
        pkg.setDuration(request.getDuration());
        pkg.setPrice(request.getPrice());
        pkg.setPetType(request.getPetType());
        pkg.setTrainingType(request.getTrainingType());

        pkg = trainerPackageRepository.save(pkg);
        return mapToResponse(pkg);
    }

    // Delete package
    @Transactional
    public void deletePackage(Long packageId, Long trainerId) {
        TrainerPackage pkg = trainerPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (!pkg.getTrainer().getUserId().equals(trainerId)) {
            throw new RuntimeException("Access denied");
        }

        trainerPackageRepository.delete(pkg);
    }

    // Toggle package active status
    @Transactional
    public TrainerPackageResponse togglePackageStatus(Long packageId, Long trainerId) {
        TrainerPackage pkg = trainerPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (!pkg.getTrainer().getUserId().equals(trainerId)) {
            throw new RuntimeException("Access denied");
        }

        pkg.setIsActive(!pkg.getIsActive());
        pkg = trainerPackageRepository.save(pkg);
        return mapToResponse(pkg);
    }

    // Map entity to response DTO
    private TrainerPackageResponse mapToResponse(TrainerPackage pkg) {
        return TrainerPackageResponse.builder()
                .packageId(pkg.getPackageId())
                .packageName(pkg.getPackageName())
                .description(pkg.getDescription())
                .duration(pkg.getDuration())
                .price(pkg.getPrice())
                .petType(pkg.getPetType())
                .trainingType(pkg.getTrainingType())
                .isActive(pkg.getIsActive())
                .trainerId(pkg.getTrainer().getUserId())
                .trainerName(pkg.getTrainer().getFirstName() + " " + pkg.getTrainer().getLastName())
                .trainerExpertise(pkg.getTrainer().getExpertise())
                .trainerPhone(pkg.getTrainer().getPhoneNumber())
                .createdAt(pkg.getCreatedAt())
                .build();
    }
}
