package com.petcare.backend.repository;

import com.petcare.backend.entity.BillingInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingInvoiceRepository extends JpaRepository<BillingInvoice, Long> {
    List<BillingInvoice> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<BillingInvoice> findByAppointmentId(Long appointmentId);
}
