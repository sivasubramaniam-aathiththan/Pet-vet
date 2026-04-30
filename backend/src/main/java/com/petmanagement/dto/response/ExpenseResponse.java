package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Expense Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {
    private Long expenseId;
    private String category;
    private Double amount;
    private LocalDate expenseDate;
    private String month;
    private String description;
    
    // Pet info
    private Long petId;
    private String petName;
    
    private LocalDateTime createdAt;
}