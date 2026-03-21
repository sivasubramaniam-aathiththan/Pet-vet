package com.petmanagement.repository;

import com.petmanagement.entity.Order;
import com.petmanagement.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OrderItem Repository
 * 
 * Handles database operations for OrderItem entity
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find all order items by order
    List<OrderItem> findByOrder(Order order);
    
    // Delete all order items by order
    void deleteByOrder(Order order);
}
