package com.petmanagement.repository;

import com.petmanagement.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Pet Repository
 * 
 * Handles database operations for Pet entity
 */
@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    
    // Find all pets by user
    List<Pet> findByUserUserId(Long userId);
    
    // Find pet by id and user (for security)
    Optional<Pet> findByPetIdAndUserUserId(Long petId, Long userId);
    
    // Count pets by user
    long countByUserUserId(Long userId);

    // Find all pets from appointments with a given doctor
    @Query("SELECT DISTINCT a.pet FROM Appointment a WHERE a.doctor.userId = :doctorId")
    List<Pet> findPetsForDoctor(@Param("doctorId") Long doctorId);
    
    // Find pets by breed
    List<Pet> findByBreedContainingIgnoreCase(String breed);
    
    // Find pets by species
    List<Pet> findBySpeciesContainingIgnoreCase(String species);
    
    // Search pets by name
    List<Pet> findByPetNameContainingIgnoreCase(String petName);
    
    // Get all pets with vaccinations
    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.vaccinations WHERE p.petId = :petId")
    Optional<Pet> findByIdWithVaccinations(@Param("petId") Long petId);
    
    // Get all pets with expenses
    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.expenses WHERE p.petId = :petId")
    Optional<Pet> findByIdWithExpenses(@Param("petId") Long petId);
}
