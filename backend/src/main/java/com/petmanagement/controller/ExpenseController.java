package com.petmanagement.controller;

import com.petmanagement.dto.request.ExpenseRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.ExpenseResponse;
import com.petmanagement.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Expense Controller
 * 
 * Handles expense tracking for pets
 * Accessible by USER and ADMIN roles
 */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    // Get expenses by pet
    @GetMapping("/pet/{petId}")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpensesByPet(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<ExpenseResponse> expenses = expenseService.getExpensesByPet(petId, userId);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    // Get all expenses for user
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getUserExpenses(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<ExpenseResponse> expenses = expenseService.getExpensesByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    // Add expense
    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> addExpense(
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        ExpenseResponse expense = expenseService.addExpense(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Expense added successfully", expense));
    }

    // Update expense
    @PutMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        ExpenseResponse expense = expenseService.updateExpense(expenseId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", expense));
    }

    // Delete expense
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long expenseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        expenseService.deleteExpense(expenseId, userId);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully"));
    }

    // Get monthly expense summary by pet
    @GetMapping("/pet/{petId}/summary/monthly")
    public ResponseEntity<ApiResponse<List<Object[]>>> getMonthlyExpenseSummary(@PathVariable Long petId) {
        List<Object[]> summary = expenseService.getMonthlyExpenseSummaryByPet(petId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    // Get category expense summary by pet
    @GetMapping("/pet/{petId}/summary/category")
    public ResponseEntity<ApiResponse<List<Object[]>>> getCategoryExpenseSummary(@PathVariable Long petId) {
        List<Object[]> summary = expenseService.getCategoryExpenseSummaryByPet(petId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    // Get total expense by pet
    @GetMapping("/pet/{petId}/total")
    public ResponseEntity<ApiResponse<Double>> getTotalExpenseByPet(@PathVariable Long petId) {
        Double total = expenseService.getTotalExpenseByPet(petId);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        return Long.parseLong(userDetails.getUsername());
    }
}
