package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Product Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long productId;
    private String productName;
    private String description;
    private String externalEcommerceLink;
    private String imageUrl;
    private String category;
    private String brand;
    private Double price;
    private Integer stockQuantity;
    private Boolean isActive;
    private LocalDateTime createdAt;
}