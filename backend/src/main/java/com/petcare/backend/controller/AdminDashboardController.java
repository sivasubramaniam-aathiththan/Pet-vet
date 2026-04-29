package com.petcare.backend.controller;

import com.petcare.backend.entity.BillingInvoice;
import com.petcare.backend.repository.BillingInvoiceRepository;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long activeUsers = userRepository.count();
        stats.put("activeUsers", activeUsers);

        List<BillingInvoice> invoices = billingInvoiceRepository.findAll();
        double totalRevenue = invoices.stream().mapToDouble(BillingInvoice::getFinalTotal).sum();
        stats.put("totalRevenue", totalRevenue);

        stats.put("systemHealth", 100);

        return ResponseEntity.ok(stats);
    }
}
