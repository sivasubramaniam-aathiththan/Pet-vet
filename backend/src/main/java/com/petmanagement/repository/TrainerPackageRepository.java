package com.petmanagement.repository;

import com.petmanagement.entity.TrainerPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Trainer Package Repository
 * 
 * Handles database operations for TrainerPackage entity
 */
@Repository
public interface TrainerPackageRepository extends JpaRepository<TrainerPackage, Long> {
    
    // Find all packages by trainer
    @Query("SELECT t FROM TrainerPackage t WHERE t.trainer.userId = :trainerId")
    List<TrainerPackage> findByTrainerId(@Param("trainerId") Long trainerId);
    
    // Find all active packages
    @Query("SELECT t FROM TrainerPackage t WHERE t.isActive = true ORDER BY t.createdAt DESC")
    List<TrainerPackage> findAllActivePackages();
    
    // Find packages by pet type
    @Query("SELECT t FROM TrainerPackage t WHERE t.petType = :petType AND t.isActive = true")
    List<TrainerPackage> findByPetTypeAndActive(@Param("petType") String petType);
    
    // Find packages by training type
    @Query("SELECT t FROM TrainerPackage t WHERE t.trainingType = :trainingType AND t.isActive = true")
    List<TrainerPackage> findByTrainingTypeAndActive(@Param("trainingType") String trainingType);
    
    // Find packages by trainer and active
    @Query("SELECT t FROM TrainerPackage t WHERE t.trainer.userId = :trainerId AND t.isActive = true")
    List<TrainerPackage> findByTrainerIdAndActive(@Param("trainerId") Long trainerId);
    
    // Find packages by price range
    @Query("SELECT t FROM TrainerPackage t WHERE t.price BETWEEN :minPrice AND :maxPrice AND t.isActive = true")
    List<TrainerPackage> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    // Count packages by trainer
    @Query("SELECT COUNT(t) FROM TrainerPackage t WHERE t.trainer.userId = :trainerId")
    long countByTrainerId(@Param("trainerId") Long trainerId);
}
