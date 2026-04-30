package com.petmanagement.repository;

import com.petmanagement.entity.Cart;
import com.petmanagement.entity.CartItem;
import com.petmanagement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * CartItem Repository
 * 
 * Handles database operations for CartItem entity
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Find cart item by cart and product
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    
    // Check if cart item exists by cart and product
    boolean existsByCartAndProduct(Cart cart, Product product);
    
    // Delete all cart items by cart
    void deleteByCart(Cart cart);
}
