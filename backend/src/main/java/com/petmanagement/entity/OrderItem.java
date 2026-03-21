package com.petmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

/**
 * OrderItem Entity
 * 
 * Represents an item in an order
 * 
 * Database Table: order_items
 * Primary Key: orderItemId
 * 
 * Relationships:
 * - Many-to-One with Order: An order item belongs to an order
 * - Many-to-One with Product: An order item references a product
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @NotNull(message = "Order is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @Positive(message = "Unit price must be positive")
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    // Calculate subtotal for this item
    public Double getSubtotal() {
        return unitPrice * quantity;
    }
}
