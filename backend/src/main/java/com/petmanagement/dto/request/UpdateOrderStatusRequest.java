package com.petmanagement.dto.request;

import com.petmanagement.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Update Order Status Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    @NotNull(message = "Status is required")
    private OrderStatus status;
}
