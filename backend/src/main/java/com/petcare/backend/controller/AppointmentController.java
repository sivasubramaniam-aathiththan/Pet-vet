package com.petcare.backend.controller;

import com.petcare.backend.entity.Appointment;
import com.petcare.backend.entity.AppointmentStatus;
import com.petcare.backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        if (appointment != null) {
            return ResponseEntity.ok(appointment);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Appointment> getAppointmentsByOwner(@PathVariable Long ownerId) {
        return appointmentService.getAppointmentsByOwner(ownerId);
    }

    @GetMapping("/vet/{vetId}/enriched")
    public List<Map<String, Object>> getEnrichedAppointmentsForVet(@PathVariable Long vetId) {
        return appointmentService.getEnrichedAppointmentsForVet(vetId);
    }

    @GetMapping("/owner/{ownerId}/enriched")
    public List<Map<String, Object>> getEnrichedAppointmentsForOwner(@PathVariable Long ownerId) {
        return appointmentService.getEnrichedAppointmentsForOwner(ownerId);
    }

    @GetMapping("/vet/{vetId}")
    public List<Appointment> getAppointmentsByVet(@PathVariable Long vetId) {
        return appointmentService.getAppointmentsByVet(vetId);
    }

    @GetMapping("/vet/{vetId}/today")
    public List<Appointment> getTodayAppointments(@PathVariable Long vetId) {
        return appointmentService.getTodayAppointmentsForVet(vetId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestBody AppointmentStatus status) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(id, appointment);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
