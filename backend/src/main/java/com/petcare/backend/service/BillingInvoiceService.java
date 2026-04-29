package com.petcare.backend.service;

import com.petcare.backend.entity.BillingInvoice;
import com.petcare.backend.entity.InvoiceItem;
import com.petcare.backend.entity.Product;
import com.petcare.backend.repository.BillingInvoiceRepository;
import com.petcare.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillingInvoiceService {

    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    @Autowired
    private ProductRepository productRepository;

    public BillingInvoice createInvoice(BillingInvoice invoice) {
        // Calculate totals dynamically before saving just to be sure
        double productsTotal = 0.0;
        if (invoice.getItems() != null) {
            for (InvoiceItem item : invoice.getItems()) {
                if (item.getProduct() != null && item.getProduct().getId() != null) {
                    Product dbProduct = productRepository.findById(item.getProduct().getId()).orElse(null);
                    if (dbProduct != null) {
                        item.setProduct(dbProduct);
                    } else {
                        // Prevent Transient/Detached Entity Exception by nullifying missing product ref
                        item.setProduct(null);
                    }
                }
                item.setSubtotal(item.getUnitPrice() * item.getQuantity());
                productsTotal += item.getSubtotal();
            }
        }
        invoice.setProductsSubtotal(productsTotal);

        double total = (invoice.getAppointmentFee() != null ? invoice.getAppointmentFee() : 0.0) + (invoice.getProductsSubtotal() != null ? invoice.getProductsSubtotal() : 0.0);
        if (invoice.getDiscountAmount() != null) {
            total -= invoice.getDiscountAmount();
        }
        invoice.setFinalTotal(Math.max(0.0, total));
        
        // SLA: Standard Delivery takes 3 days
        if (invoice.getExpectedDeliveryDate() == null) {
            invoice.setExpectedDeliveryDate(LocalDateTime.now().plusDays(3));
        }
        if (invoice.getOrderStatus() == null) {
            invoice.setOrderStatus("PROCESSING");
        }
        
        return billingInvoiceRepository.save(invoice);
    }

    public List<BillingInvoice> getUserInvoices(Long userId) {
        return billingInvoiceRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public BillingInvoice getInvoiceById(Long id) {
        return billingInvoiceRepository.findById(id).orElse(null);
    }

    public BillingInvoice markAsPaid(Long invoiceId) {
        BillingInvoice invoice = getInvoiceById(invoiceId);
        if (invoice != null) {
            invoice.setStatus("PAID");
            invoice.setPaidAt(LocalDateTime.now());
            return billingInvoiceRepository.save(invoice);
        }
        return null;
    }

    public List<BillingInvoice> getAllInvoices() {
        return billingInvoiceRepository.findAll();
    }

    public BillingInvoice updateOrderStatus(Long id, String status) {
        BillingInvoice invoice = getInvoiceById(id);
        if (invoice != null) {
            invoice.setOrderStatus(status);
            if (status.equals("DELIVERED") && invoice.getActualDeliveryDate() == null) {
                invoice.setActualDeliveryDate(LocalDateTime.now());
            }
            return billingInvoiceRepository.save(invoice);
        }
        return null;
    }
}
