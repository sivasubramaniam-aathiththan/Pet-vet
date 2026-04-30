package com.petmanagement.service;

import com.petmanagement.dto.request.ExpenseRequest;
import com.petmanagement.dto.response.ExpenseResponse;
import com.petmanagement.entity.Expense;
import com.petmanagement.entity.Pet;
import com.petmanagement.repository.ExpenseRepository;
import com.petmanagement.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Expense Service
 * 
 * Handles expense tracking for pets
 */
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final PetRepository petRepository;

    // Get expenses by pet
    public List<ExpenseResponse> getExpensesByPet(Long petId, Long userId) {
        return expenseRepository.findByPetIdAndUserId(petId, userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all expenses for user
    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add expense
    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request, Long userId) {
        Pet pet = petRepository.findByPetIdAndUserUserId(request.getPetId(), userId)
                .orElseThrow(() -> new RuntimeException("Pet not found or access denied"));

        Expense expense = Expense.builder()
                .category(request.getCategory())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .pet(pet)
                .build();

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    // Update expense
    @Transactional
    public ExpenseResponse updateExpense(Long expenseId, ExpenseRequest request, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getPet().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    // Delete expense
    @Transactional
    public void deleteExpense(Long expenseId, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getPet().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        expenseRepository.delete(expense);
    }

    // Get monthly expense summary by pet
    public List<Object[]> getMonthlyExpenseSummaryByPet(Long petId) {
        return expenseRepository.getMonthlyExpenseSummaryByPet(petId);
    }

    // Get category expense summary by pet
    public List<Object[]> getCategoryExpenseSummaryByPet(Long petId) {
        return expenseRepository.getCategoryExpenseSummaryByPet(petId);
    }

    // Get total expense by pet
    public Double getTotalExpenseByPet(Long petId) {
        return expenseRepository.getTotalExpenseByPet(petId);
    }

    // Map entity to response DTO
    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .expenseId(expense.getExpenseId())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .expenseDate(expense.getExpenseDate())
                .month(expense.getMonth())
                .description(expense.getDescription())
                .petId(expense.getPet().getPetId())
                .petName(expense.getPet().getPetName())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}
