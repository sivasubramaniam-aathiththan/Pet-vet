package com.petmanagement.entity;

/**
 * Order Status Enum
 * 
 * Defines the possible statuses of an order
 */
public enum OrderStatus {
    PENDING,        // Order has been placed, awaiting confirmation
    CONFIRMED,      // Order has been confirmed by admin
    PROCESSING,     // Order is being processed
    SHIPPED,        // Order has been shipped
    DELIVERED,      // Order has been delivered
    CANCELLED,      // Order has been cancelled
    REFUNDED        // Order has been refunded
}
