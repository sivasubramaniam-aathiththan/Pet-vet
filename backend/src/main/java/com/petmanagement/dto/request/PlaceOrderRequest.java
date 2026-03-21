package com.petmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Place Order Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    @NotBlank(message = "Shipping phone is required")
    private String shippingPhone;
    
    private String orderNotes;
}
