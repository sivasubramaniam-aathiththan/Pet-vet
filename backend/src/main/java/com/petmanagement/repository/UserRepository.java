package com.petmanagement.repository;

import com.petmanagement.entity.Role;
import com.petmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository
 * 
 * Handles database operations for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find by username (for authentication)
    Optional<User> findByUsername(String username);
    
    // Find by email
    Optional<User> findByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find all by role
    List<User> findByRole(Role role);
    
    // Find all doctors
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.enabled = true")
    List<User> findAllDoctors();
    
    // Find all trainers
    @Query("SELECT u FROM User u WHERE u.role = 'TRAINER' AND u.enabled = true")
    List<User> findAllTrainers();
    
    // Find all regular users
    @Query("SELECT u FROM User u WHERE u.role = 'USER'")
    List<User> findAllRegularUsers();
    
    // Count by role
    long countByRole(Role role);
    
    // Find by username or email
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    // Find enabled users by role
    List<User> findByRoleAndEnabledTrue(Role role);
}
