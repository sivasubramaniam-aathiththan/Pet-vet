package com.petcare.backend.controller;

import com.petcare.backend.entity.User;
import com.petcare.backend.entity.Role;
import com.petcare.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for managing user accounts, authentication, and administrative oversight.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Registers a new user account with role-based approval logic.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("user", registeredUser);
            response.put("message", user.getRole() == Role.OWNER 
                ? "Registration successful" 
                : "Registration submitted. Awaiting administrative approval.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Authenticates users using identifiers (username/email) and secures access to dashboards.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String identifier = credentials.get("username");
            if (identifier == null) identifier = credentials.get("email");
            if (identifier == null) identifier = credentials.get("identifier");
            
            String password = credentials.get("password");
            User user = userService.login(identifier, password);
            
            // Protect credentials in response
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retrieves a specific user profile by its unique identifier.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Fetches the complete directory of users for administrative audit.
     */
    @GetMapping
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    /**
     * Filters the user directory by professional or personal role.
     */
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable Role role) {
        List<User> users = userService.getUsersByRole(role);
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    /**
     * Lists all professional accounts currently awaiting administrative verification.
     */
    @GetMapping("/pending-approvals")
    public List<User> getPendingApprovals() {
        List<User> users = userService.getPendingApprovals();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    /**
     * Grants administrative approval to a professional user account.
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        User user = userService.approveUser(id);
        if (user != null) {
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Updates an existing user's profile information.
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        if (updated != null) {
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Permanently removes a user account from the platform.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Toggles the operational status (Active/Suspended) for a user account.
     */
    @PutMapping("/{id}/toggle")
    public ResponseEntity<User> toggleStatus(@PathVariable Long id) {
        User updated = userService.toggleUserStatus(id);
        if (updated != null) {
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
