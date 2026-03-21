package com.petmanagement.repository;

import com.petmanagement.entity.Order;
import com.petmanagement.entity.OrderStatus;
import com.petmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Order Repository
 * 
 * Handles database operations for Order entity
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find all orders for a user
    List<Order> findByUser(User user);
    
    // Find all orders for a user ordered by creation date
    @Query("SELECT o FROM Order o WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<Order> findByUserOrderByCreatedAtDesc(@Param("user") User user);
    
    // Find all orders by status
    List<Order> findByStatus(OrderStatus status);
    
    // Find all orders by status ordered by creation date
    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findByStatusOrderByCreatedAtDesc(@Param("status") OrderStatus status);
    
    // Count orders by user
    long countByUser(User user);
    
    // Count orders by status
    long countByStatus(OrderStatus status);
    
    // Get all orders ordered by creation date
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();
}
