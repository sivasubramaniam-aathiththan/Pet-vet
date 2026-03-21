package com.petmanagement.dto.response;

import lombok.*;
import java.util.List;

/**
 * Cart Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> cartItems;
    private Double totalAmount;
    private Integer totalItemCount;
}
