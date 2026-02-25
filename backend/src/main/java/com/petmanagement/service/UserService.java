package com.petmanagement.service;

import com.petmanagement.dto.request.CreateStaffRequest;
import com.petmanagement.dto.response.UserResponse;
import com.petmanagement.entity.Role;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User Service
 * 
 * Handles user management operations
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Get user by ID
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    // Get all users (Admin only)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all doctors
    public List<UserResponse> getAllDoctors() {
        return userRepository.findAllDoctors().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all trainers
    public List<UserResponse> getAllTrainers() {
        return userRepository.findAllTrainers().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all regular users (Admin only)
    public List<UserResponse> getAllRegularUsers() {
        return userRepository.findAllRegularUsers().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Create staff (Doctor or Trainer) - Admin only
    @Transactional
    public UserResponse createStaff(CreateStaffRequest request) {
        // Validate role
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
            if (role != Role.DOCTOR && role != Role.TRAINER) {
                throw new RuntimeException("Invalid role. Only DOCTOR or TRAINER allowed.");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role(role)
                .specialization(role == Role.DOCTOR ? request.getSpecialization() : null)
                .availability(role == Role.DOCTOR ? request.getAvailability() : null)
                .expertise(role == Role.TRAINER ? request.getExpertise() : null)
                .enabled(true)
                .build();

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    // Delete user (Admin only)
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Prevent deleting admin users
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot delete admin users");
        }
        
        userRepository.delete(user);
    }

    // Enable/Disable user (Admin only)
    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.getEnabled());
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    // Get user count by role
    public long getUserCountByRole(Role role) {
        return userRepository.countByRole(role);
    }

    // Get total user count
    public long getTotalUserCount() {
        return userRepository.count();
    }

    // Map entity to response DTO
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .specialization(user.getSpecialization())
                .availability(user.getAvailability())
                .expertise(user.getExpertise())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
