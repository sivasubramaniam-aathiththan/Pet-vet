package com.petmanagement.repository;

import com.petmanagement.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Expense Repository
 * 
 * Handles database operations for Expense entity
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    // Find all expenses by pet
    List<Expense> findByPetPetId(Long petId);
    
    // Find expenses by pet and user (for security)
    @Query("SELECT e FROM Expense e WHERE e.pet.petId = :petId AND e.pet.user.userId = :userId")
    List<Expense> findByPetIdAndUserId(@Param("petId") Long petId, @Param("userId") Long userId);
    
    // Find expenses by user
    @Query("SELECT e FROM Expense e WHERE e.pet.user.userId = :userId")
    List<Expense> findByUserId(@Param("userId") Long userId);
    
    // Find expenses by month
    List<Expense> findByMonth(String month);
    
    // Find expenses by pet and month
    List<Expense> findByPetPetIdAndMonth(Long petId, String month);
    
    // Find expenses by category
    List<Expense> findByCategory(String category);
    
    // Get monthly expense summary by pet
    @Query("SELECT e.month, SUM(e.amount) FROM Expense e WHERE e.pet.petId = :petId GROUP BY e.month ORDER BY e.month DESC")
    List<Object[]> getMonthlyExpenseSummaryByPet(@Param("petId") Long petId);
    
    // Get category-wise expense summary by pet
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.pet.petId = :petId GROUP BY e.category")
    List<Object[]> getCategoryExpenseSummaryByPet(@Param("petId") Long petId);
    
    // Get total expense by pet
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.pet.petId = :petId")
    Double getTotalExpenseByPet(@Param("petId") Long petId);
    
    // Get monthly expense summary by user
    @Query("SELECT e.month, SUM(e.amount) FROM Expense e WHERE e.pet.user.userId = :userId GROUP BY e.month ORDER BY e.month DESC")
    List<Object[]> getMonthlyExpenseSummaryByUser(@Param("userId") Long userId);
}
