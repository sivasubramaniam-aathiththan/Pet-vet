package com.petmanagement.dto.response;

import lombok.*;

/**
 * Order Item Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long orderItemId;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double unitPrice;
    private Integer quantity;
    private Double subtotal;
}
