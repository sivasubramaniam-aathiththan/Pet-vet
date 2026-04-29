package com.petcare.backend.controller;

import com.petcare.backend.entity.Notification;
import com.petcare.backend.repository.NotificationRepository;
import com.petcare.backend.service.VaccinationAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"})
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private VaccinationAlertService vaccinationAlertService;

    @PostMapping("/trigger-alerts")
    public ResponseEntity<String> triggerAlerts() {
        vaccinationAlertService.generateVaccinationAlerts();
        return ResponseEntity.ok("Alert generation triggered successfully.");
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Notification>> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(notificationRepository.findByTargetRoleOrderByCreatedAtDesc(role));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setReadStatus(true);
            return ResponseEntity.ok(notificationRepository.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }
}
