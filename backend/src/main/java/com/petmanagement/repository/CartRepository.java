package com.petmanagement.repository;

import com.petmanagement.entity.Cart;
import com.petmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Cart Repository
 * 
 * Handles database operations for Cart entity
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    // Find cart by user
    Optional<Cart> findByUser(User user);
    
    // Check if cart exists for user
    boolean existsByUser(User user);
    
    // Delete cart by user
    void deleteByUser(User user);
}
