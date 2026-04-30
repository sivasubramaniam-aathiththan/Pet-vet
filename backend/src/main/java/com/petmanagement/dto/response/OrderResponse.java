package com.petmanagement.dto.response;

import com.petmanagement.entity.OrderStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String userName;
    private String userEmail;
    private List<OrderItemResponse> orderItems;
    private Double totalAmount;
    private OrderStatus status;
    private String shippingAddress;
    private String shippingPhone;
    private String orderNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
