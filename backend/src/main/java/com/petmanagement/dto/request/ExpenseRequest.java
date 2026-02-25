package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.time.LocalDate;

/**
 * Expense Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {
    @NotBlank(message = "Category is required")
    private String category; // food, medical, other
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;
    
    @NotNull(message = "Pet ID is required")
    private Long petId;
    
    private String description;
}