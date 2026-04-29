package com.petcare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId; // The owner paying
    private Long appointmentId; // Optional link to an appointment

    private Long petId; // For per-pet expense tracking
    private String petName;

    private Double appointmentFee = 0.0;
    private Double productsSubtotal = 0.0;
    
    private String appliedPromoCode;
    private Double discountAmount = 0.0;
    
    private Double finalTotal = 0.0;
    private String status = "PENDING"; // PENDING, PAID, CANCELLED

    private LocalDateTime createdAt;
    private LocalDateTime paidAt;

    // Delivery & Order Tracking
    private String orderStatus = "PROCESSING"; // PROCESSING, SHIPPED, DELIVERED, CANCELLED
    private String shippingAddress;
    private String contactNumber;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime actualDeliveryDate;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "invoice_id")
    private List<InvoiceItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
