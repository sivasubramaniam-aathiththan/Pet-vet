package com.petmanagement.service;

import com.petmanagement.dto.request.AppointmentRequest;
import com.petmanagement.dto.response.AppointmentResponse;
import com.petmanagement.entity.Appointment;
import com.petmanagement.entity.Pet;
import com.petmanagement.entity.User;
import com.petmanagement.repository.AppointmentRepository;
import com.petmanagement.repository.PetRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Appointment Service
 * 
 * Handles appointment booking and management
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    // Get appointments by user
    public List<AppointmentResponse> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get appointments by doctor
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get upcoming appointments for user
    public List<AppointmentResponse> getUpcomingAppointmentsByUser(Long userId) {
        return appointmentRepository.findUpcomingAppointmentsByUser(userId, LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get upcoming appointments for doctor
    public List<AppointmentResponse> getUpcomingAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findUpcomingAppointmentsByDoctor(doctorId, LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Book appointment
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request, Long userId) {
        // Check if doctor is available at this time
        if (appointmentRepository.existsByDoctorAndDateAndTime(
                request.getDoctorId(), request.getAppointmentDate(), request.getAppointmentTime())) {
            throw new RuntimeException("Doctor is not available at this time");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pet pet = petRepository.findByPetIdAndUserUserId(request.getPetId(), userId)
                .orElseThrow(() -> new RuntimeException("Pet not found or access denied"));

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .status("PENDING")
                .reason(request.getReason())
                .notes(request.getNotes())
                .pet(pet)
                .doctor(doctor)
                .user(user)
                .build();

        appointment = appointmentRepository.save(appointment);
        return mapToResponse(appointment);
    }

    // Update appointment status
    @Transactional
    public AppointmentResponse updateStatus(Long appointmentId, String status, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check if user owns this appointment or is the doctor
        if (!appointment.getUser().getUserId().equals(userId) && 
            !appointment.getDoctor().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        appointment.setStatus(status);
        appointment = appointmentRepository.save(appointment);
        return mapToResponse(appointment);
    }

    // Cancel appointment
    @Transactional
    public void cancelAppointment(Long appointmentId, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check if user owns this appointment
        if (!appointment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }

    // Get available doctors
    public List<AppointmentResponse> getAvailableDoctors() {
        return userRepository.findAllDoctors().stream()
                .map(doctor -> AppointmentResponse.builder()
                        .doctorId(doctor.getUserId())
                        .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                        .doctorSpecialization(doctor.getSpecialization())
                        .build())
                .collect(Collectors.toList());
    }

    // Map entity to response DTO
    private AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .appointmentId(appointment.getAppointmentId())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .petId(appointment.getPet().getPetId())
                .petName(appointment.getPet().getPetName())
                .doctorId(appointment.getDoctor().getUserId())
                .doctorName(appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName())
                .doctorSpecialization(appointment.getDoctor().getSpecialization())
                .userId(appointment.getUser().getUserId())
                .userName(appointment.getUser().getFirstName() + " " + appointment.getUser().getLastName())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}
