package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

/**
 * Product Request DTO
 * For admin to add product suggestions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String productName;
    
    private String description;
    
    @NotBlank(message = "External link is required")
    private String externalEcommerceLink;
    
    private String imageUrl;
    private String category;
    private String brand;
    
    @Positive(message = "Price must be positive")
    private Double price;
}