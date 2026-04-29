package com.petcare.backend.service;

import com.petcare.backend.entity.Appointment;
import com.petcare.backend.entity.AppointmentStatus;
import com.petcare.backend.repository.AppointmentRepository;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    private Map<String, Object> enrichAppointment(Appointment appt) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", appt.getId());
        map.put("petId", appt.getPetId());
        map.put("ownerId", appt.getOwnerId());
        map.put("vetId", appt.getVetId());
        map.put("appointmentDate", appt.getAppointmentDate());
        map.put("status", appt.getStatus());
        map.put("reason", appt.getReason());
        map.put("serviceType", appt.getServiceType());
        map.put("serviceCost", appt.getServiceCost());
        map.put("clinicFee", appt.getClinicFee());
        map.put("notes", appt.getNotes());
        map.put("paid", appt.isPaid());
        map.put("createdAt", appt.getCreatedAt());

        // Data enrichment logic: Try to get latest from pet record first
        petRepository.findById(appt.getPetId()).ifPresentOrElse(pet -> {
            map.put("petName", pet.getName());
            map.put("petSpecies", pet.getSpecies());
            map.put("petBreed", pet.getBreed());
            map.put("isPetActive", true);
        }, () -> {
            // If pet record is deleted, use the name archived in the appointment
            map.put("petName", appt.getPetName() != null ? appt.getPetName() : "Unknown Pet");
            map.put("petSpecies", "Undefined");
            map.put("isPetActive", false); // Flag for frontend to show 'Removed' status
        });
        userRepository.findById(appt.getOwnerId()).ifPresent(owner -> {
            map.put("ownerName", owner.getFullName());
            map.put("ownerPhone", owner.getPhone());
        });
        userRepository.findById(appt.getVetId()).ifPresent(vet -> {
            map.put("vetName", vet.getFullName());
            map.put("vetSpecialization", vet.getSpecialization());
        });
        return map;
    }

    public List<Map<String, Object>> getEnrichedAppointmentsForVet(Long vetId) {
        List<Appointment> appointments = appointmentRepository.findByVetId(vetId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Appointment appt : appointments) {
            Map<String, Object> enriched = enrichAppointment(appt);
            // Only include if pet is still active (not orphaned)
            if (enriched.get("isPetActive") != null && (Boolean) enriched.get("isPetActive")) {
                result.add(enriched);
            }
        }
        // Latest first (descending)
        result.sort((m1, m2) -> ((LocalDateTime) m2.get("appointmentDate")).compareTo((LocalDateTime) m1.get("appointmentDate")));
        return result;
    }

    public List<Map<String, Object>> getEnrichedAppointmentsForOwner(Long ownerId) {
        List<Appointment> appointments = appointmentRepository.findByOwnerId(ownerId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Appointment appt : appointments) {
            Map<String, Object> enriched = enrichAppointment(appt);
            if (enriched.get("isPetActive") != null && (Boolean) enriched.get("isPetActive")) {
                result.add(enriched);
            }
        }
        result.sort((m1, m2) -> ((LocalDateTime) m2.get("appointmentDate")).compareTo((LocalDateTime) m1.get("appointmentDate")));
        return result;
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setCreatedAt(LocalDateTime.now());
        // Archive the pet name in the appointment record for persistence
        petRepository.findById(appointment.getPetId()).ifPresent(pet -> {
            appointment.setPetName(pet.getName());
        });
        appointment.setPaid(appointment.isPaid());
        appointment.setStatus(AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByOwner(Long ownerId) {
        return appointmentRepository.findByOwnerId(ownerId);
    }

    public List<Appointment> getAppointmentsByVet(Long vetId) {
        return appointmentRepository.findByVetId(vetId);
    }

    public List<Appointment> getTodayAppointmentsForVet(Long vetId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return appointmentRepository.findByVetIdAndAppointmentDateBetween(vetId, startOfDay, endOfDay);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = getAppointmentById(id);
        if (appointment != null) {
            appointment.setStatus(status);
            appointment.setUpdatedAt(LocalDateTime.now());
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    public Appointment updateAppointment(Long id, Appointment updatedAppointment) {
        Appointment appointment = getAppointmentById(id);
        if (appointment != null) {
            appointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
            appointment.setReason(updatedAppointment.getReason());
            appointment.setNotes(updatedAppointment.getNotes());
            if (updatedAppointment.getClinicFee() != null) {
                appointment.setClinicFee(updatedAppointment.getClinicFee());
            }
            appointment.setUpdatedAt(LocalDateTime.now());
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
