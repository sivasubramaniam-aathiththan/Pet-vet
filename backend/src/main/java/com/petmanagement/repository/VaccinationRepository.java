package com.petmanagement.repository;

import com.petmanagement.entity.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Vaccination Repository
 * 
 * Handles database operations for Vaccination entity
 */
@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {
    
    // Find all vaccinations by pet
    List<Vaccination> findByPetPetId(Long petId);
    
    // Find vaccinations by pet and user (for security)
    @Query("SELECT v FROM Vaccination v WHERE v.pet.petId = :petId AND v.pet.user.userId = :userId")
    List<Vaccination> findByPetIdAndUserId(@Param("petId") Long petId, @Param("userId") Long userId);
    
    // Find vaccinations due soon (within next 7 days)
    @Query("SELECT v FROM Vaccination v WHERE v.nextVaccinationDate BETWEEN :today AND :futureDate")
    List<Vaccination> findVaccinationsDueSoon(@Param("today") LocalDate today, @Param("futureDate") LocalDate futureDate);
    
    // Find overdue vaccinations
    @Query("SELECT v FROM Vaccination v WHERE v.nextVaccinationDate < :today")
    List<Vaccination> findOverdueVaccinations(@Param("today") LocalDate today);
    
    // Find vaccinations by user
    @Query("SELECT v FROM Vaccination v WHERE v.pet.user.userId = :userId")
    List<Vaccination> findByUserId(@Param("userId") Long userId);
    
    // Find vaccinations by vaccine name
    List<Vaccination> findByVaccineNameContainingIgnoreCase(String vaccineName);
    
    // Count vaccinations by pet
    long countByPetPetId(Long petId);
}
