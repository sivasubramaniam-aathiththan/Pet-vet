package com.petcare.backend.config;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.petcare.backend.entity.Role;
import com.petcare.backend.entity.User;
import com.petcare.backend.repository.UserRepository;

/**
 * Initializes default admin user on application startup if not exists.
 */
@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        Optional<User> existingAdmin = userRepository.findByEmail("s.aathiththan14@gmail.com");
        
        if (existingAdmin.isEmpty()) {
            // Create new admin user
            User admin = new User();
            admin.setEmail("s.aathiththan14@gmail.com");
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setFullName("Admin");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setIsApproved(true);
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            System.out.println("✓ Admin user created successfully!");
            System.out.println("  Email: s.aathiththan14@gmail.com");
            System.out.println("  Password: admin123");
        } else {
            System.out.println("✓ Admin user already exists.");
        }
    }
}
