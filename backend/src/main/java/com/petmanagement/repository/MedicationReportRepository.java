package com.petmanagement.repository;

import com.petmanagement.entity.MedicationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MedicationReport Repository
 */
@Repository
public interface MedicationReportRepository extends JpaRepository<MedicationReport, Long> {
    List<MedicationReport> findByPetPetId(Long petId);
    
    // allow search by user id through pet relationship if required
    List<MedicationReport> findByPetUserUserId(Long userId);
}