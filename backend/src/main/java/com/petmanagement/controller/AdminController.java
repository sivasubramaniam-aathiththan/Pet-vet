package com.petmanagement.controller;

import com.petmanagement.dto.request.CreateStaffRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.UserResponse;
import com.petmanagement.entity.Role;
import com.petmanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Controller
 * 
 * Handles user management operations.  Doctors are also permitted to perform
 * many of the same actions (they may create staff, view users, etc.) but
 * cannot manage administrators themselves.
 */

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
public class AdminController {

    private final UserService userService;

    // Get dashboard statistics
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getTotalUserCount());
        stats.put("totalRegularUsers", userService.getUserCountByRole(Role.USER));
        stats.put("totalDoctors", userService.getUserCountByRole(Role.DOCTOR));
        stats.put("totalTrainers", userService.getUserCountByRole(Role.TRAINER));
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // Get all regular users
    @GetMapping("/users/regular")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllRegularUsers() {
        List<UserResponse> users = userService.getAllRegularUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // Get all doctors
    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllDoctors() {
        List<UserResponse> doctors = userService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // Get all trainers
    @GetMapping("/trainers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllTrainers() {
        List<UserResponse> trainers = userService.getAllTrainers();
        return ResponseEntity.ok(ApiResponse.success(trainers));
    }

    // Create staff (Doctor or Trainer) - both admins and doctors may create staff
    @PostMapping("/staff")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        UserResponse staff = userService.createStaff(request);
        return ResponseEntity.ok(ApiResponse.success("Staff created successfully", staff));
    }

    // Delete user (admin only)
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    // Toggle user status (enable/disable) - admin only
    @PutMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long userId) {
        UserResponse user = userService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }
}
