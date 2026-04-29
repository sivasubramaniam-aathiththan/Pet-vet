package com.petcare.backend.service;

import com.petcare.backend.entity.User;
import com.petcare.backend.entity.Role;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // [VALIDATION] Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // [VALIDATION] Check if username already exists
        if (user.getUsername() != null && userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        // Auto-generate username from email if not provided
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(user.getEmail().split("@")[0]);
        }
        
        // Set default values
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        
        // Auto-approve Pet Owners and Admins, require approval for Vets/Professionals unless specified
        if (user.getIsApproved() == null) {
            if (user.getRole() == Role.OWNER || user.getRole() == Role.ADMIN) {
                user.setIsApproved(true);
            } else {
                user.setIsApproved(false);
            }
        }
        
        return userRepository.save(user);
    }

    public User login(String identifier, String password) {
        // [VALIDATION] Verify identifier (username/email) and password integrity
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // [VALIDATION] Status audit checks
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is inactive");
        }
        
        // [VALIDATION] Role-based approval check
        if (!user.getIsApproved() && user.getRole() != Role.OWNER && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Account pending approval");
        }
        
        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getPendingApprovals() {
        return userRepository.findAll().stream()
                .filter(u -> !u.getIsApproved() && u.getRole() != Role.OWNER)
                .toList();
    }

    public User approveUser(Long userId) {
        User user = getUserById(userId);
        if (user != null) {
            user.setIsApproved(true);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }

    public User updateUser(Long id, User updatedUser) {
        System.out.println("Updating user profile for ID: " + id);
        User user = getUserById(id);
        if (user != null) {
            user.setFullName(updatedUser.getFullName());
            user.setPhone(updatedUser.getPhone());
            user.setAddress(updatedUser.getAddress());
            user.setUpdatedAt(LocalDateTime.now());
            
            // All professional fields should be updated even if null/empty
            user.setLicenseNumber(updatedUser.getLicenseNumber());
            user.setSpecialization(updatedUser.getSpecialization());
            user.setExperience(updatedUser.getExperience());
            
            User saved = userRepository.save(user);
            System.out.println("Saved user: " + saved.getFullName() + ", Exp: " + saved.getExperience());
            return saved;
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        if (user != null) {
            user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
}
