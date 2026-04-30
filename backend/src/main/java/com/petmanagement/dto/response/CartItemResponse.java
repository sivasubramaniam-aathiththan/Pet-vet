package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Cart Item Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double unitPrice;
    private Integer quantity;
    private Double subtotal;
    private LocalDateTime addedAt;
}
