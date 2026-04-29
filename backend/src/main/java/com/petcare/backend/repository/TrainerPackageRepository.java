package com.petcare.backend.repository;

import com.petcare.backend.entity.TrainerPackage;
import com.petcare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerPackageRepository extends JpaRepository<TrainerPackage, Long> {
    List<TrainerPackage> findByTrainerId(Long trainerId);
    List<TrainerPackage> findByIsActiveTrue();
    List<TrainerPackage> findByTrainer(User trainer);
}
