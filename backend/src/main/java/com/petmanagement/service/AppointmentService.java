package com.petmanagement.service;

import com.petmanagement.dto.request.AppointmentRequest;
import com.petmanagement.dto.response.AppointmentResponse;
import com.petmanagement.dto.response.MedicalHistoryResponse;
import com.petmanagement.dto.response.MedicationResponse;
import com.petmanagement.dto.response.PetResponse;
import com.petmanagement.dto.response.VaccinationResponse;
import com.petmanagement.entity.Appointment;
import com.petmanagement.entity.Pet;
import com.petmanagement.entity.User;
import com.petmanagement.repository.AppointmentRepository;
import com.petmanagement.repository.PetRepository;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.repository.VaccinationRepository;
import com.petmanagement.repository.MedicationReportRepository;
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
    private final VaccinationRepository vaccinationRepository;
    private final MedicationReportRepository medicationReportRepository;

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

    // Get all unique patients (pets) for a doctor from their appointments
    public List<PetResponse> getDoctorPatients(Long doctorId) {
        List<Pet> pets = petRepository.findPetsForDoctor(doctorId);
        return pets.stream()
                .map(this::mapPetToResponse)
                .collect(Collectors.toList());
    }

    // Get medical history for a pet (vaccinations and medications)
    public MedicalHistoryResponse getMedicalHistory(Long petId, Long doctorId) {
        // Verify the pet belongs to a patient of this doctor
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        // Get vaccinations for this pet
        List<VaccinationResponse> vaccinations = vaccinationRepository.findByPetPetId(petId).stream()
                .map(this::mapVaccinationToResponse)
                .collect(Collectors.toList());
        
        // Get medications for this pet
        List<MedicationResponse> medications = medicationReportRepository.findByPetPetId(petId).stream()
                .map(this::mapMedicationToResponse)
                .collect(Collectors.toList());
        
        return MedicalHistoryResponse.builder()
                .petId(pet.getPetId())
                .petName(pet.getPetName())
                .ownerName(pet.getUser().getFirstName() + " " + pet.getUser().getLastName())
                .ownerId(pet.getUser().getUserId())
                .vaccinations(vaccinations)
                .medications(medications)
                .build();
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

        // Prevent cancellation if appointment is already confirmed by doctor
        if ("CONFIRMED".equals(appointment.getStatus())) {
            throw new RuntimeException("Cannot cancel an appointment that has been confirmed by the doctor");
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
                        .firstName(doctor.getFirstName())
                        .lastName(doctor.getLastName())
                        .specialization(doctor.getSpecialization())
                        .availability(doctor.getAvailability())
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

    // Map Pet entity to PetResponse
    private PetResponse mapPetToResponse(Pet pet) {
        return PetResponse.builder()
                .petId(pet.getPetId())
                .petName(pet.getPetName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .gender(pet.getGender())
                .weight(pet.getWeight())
                .color(pet.getColor())
                .dateOfBirth(pet.getDateOfBirth())
                .userId(pet.getUser().getUserId())
                .ownerName(pet.getUser().getFirstName() + " " + pet.getUser().getLastName())
                .build();
    }

    // Map Vaccination to response
    private VaccinationResponse mapVaccinationToResponse(com.petmanagement.entity.Vaccination v) {
        return VaccinationResponse.builder()
                .vaccinationId(v.getVaccinationId())
                .vaccineName(v.getVaccineName())
                .vaccinationDate(v.getVaccinationDate())
                .nextVaccinationDate(v.getNextVaccinationDate())
                .veterinarian(v.getVeterinarian())
                .clinicName(v.getClinicName())
                .notes(v.getNotes())
                .petId(v.getPet().getPetId())
                .petName(v.getPet().getPetName())
                .createdAt(v.getCreatedAt())
                .build();
    }

    // Map MedicationReport to response
    private MedicationResponse mapMedicationToResponse(com.petmanagement.entity.MedicationReport r) {
        return MedicationResponse.builder()
                .reportId(r.getReportId())
                .medicationName(r.getMedicationName())
                .dosage(r.getDosage())
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .notes(r.getNotes())
                .petId(r.getPet().getPetId())
                .petName(r.getPet().getPetName())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
