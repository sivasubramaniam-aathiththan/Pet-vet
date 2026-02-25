package com.petmanagement.repository;

import com.petmanagement.entity.AdoptionPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Adoption Post Repository
 * 
 * Handles database operations for AdoptionPost entity
 */
@Repository
public interface AdoptionPostRepository extends JpaRepository<AdoptionPost, Long> {
    
    // Find all posts by user
    @Query("SELECT a FROM AdoptionPost a WHERE a.user.userId = :userId")
    List<AdoptionPost> findByUserId(@Param("userId") Long userId);
    
    // Find posts by status
    List<AdoptionPost> findByStatus(String status);
    
    // Find all approved posts (visible to all users)
    @Query("SELECT a FROM AdoptionPost a WHERE a.status = 'APPROVED' ORDER BY a.createdAt DESC")
    List<AdoptionPost> findAllApprovedPosts();
    
    // Find pending posts (for admin review)
    @Query("SELECT a FROM AdoptionPost a WHERE a.status = 'PENDING' ORDER BY a.createdAt DESC")
    List<AdoptionPost> findAllPendingPosts();
    
    // Find posts by pet type
    @Query("SELECT a FROM AdoptionPost a WHERE a.petType = :petType AND a.status = 'APPROVED'")
    List<AdoptionPost> findByPetTypeAndApproved(@Param("petType") String petType);
    
    // Find posts by location
    @Query("SELECT a FROM AdoptionPost a WHERE LOWER(a.location) LIKE LOWER(CONCAT('%', :location, '%')) AND a.status = 'APPROVED'")
    List<AdoptionPost> findByLocationAndApproved(@Param("location") String location);
    
    // Count posts by status
    long countByStatus(String status);
    
    // Count all posts by user
    @Query("SELECT COUNT(a) FROM AdoptionPost a WHERE a.user.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
}
