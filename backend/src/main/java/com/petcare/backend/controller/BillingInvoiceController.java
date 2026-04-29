package com.petcare.backend.controller;

import com.petcare.backend.entity.BillingInvoice;
import com.petcare.backend.service.BillingInvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class BillingInvoiceController {

    @Autowired
    private BillingInvoiceService billingInvoiceService;

    @PostMapping
    public BillingInvoice generateInvoice(@RequestBody BillingInvoice invoice) {
        return billingInvoiceService.createInvoice(invoice);
    }

    @GetMapping("/user/{userId}")
    public List<BillingInvoice> getUserInvoices(@PathVariable Long userId) {
        return billingInvoiceService.getUserInvoices(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillingInvoice> getInvoice(@PathVariable Long id) {
        BillingInvoice invoice = billingInvoiceService.getInvoiceById(id);
        return invoice != null ? ResponseEntity.ok(invoice) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<BillingInvoice> payInvoice(@PathVariable Long id) {
        BillingInvoice invoice = billingInvoiceService.markAsPaid(id);
        return invoice != null ? ResponseEntity.ok(invoice) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<BillingInvoice> getAllInvoices() {
        return billingInvoiceService.getAllInvoices();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BillingInvoice> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        BillingInvoice updated = billingInvoiceService.updateOrderStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
}
