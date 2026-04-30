package com.petmanagement.config;

import com.petmanagement.entity.Role;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data Initializer
 * 
 * Creates default users on application startup if they don't exist:
 * - Admin user for system administration
 * - Sample doctor and trainer for testing
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing default users...");
        
        // Create or update admin user
        userRepository.findByUsername("admin").ifPresentOrElse(
            existingAdmin -> {
                // Update password to ensure it's properly encoded
                existingAdmin.setPassword(passwordEncoder.encode("admin123"));
                existingAdmin.setEmail("admin@petmanagement.com");
                existingAdmin.setFirstName("System");
                existingAdmin.setLastName("Administrator");
                existingAdmin.setRole(Role.ADMIN);
                existingAdmin.setEnabled(true);
                userRepository.save(existingAdmin);
                log.info("Admin user password updated - Username: admin, Password: admin123");
            },
            () -> {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@petmanagement.com")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("System")
                        .lastName("Administrator")
                        .phoneNumber("0771234567")
                        .address("Pet Management HQ")
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                log.info("Default admin user created - Username: admin, Password: admin123");
            }
        );

        // Create or update doctor user
        userRepository.findByUsername("doctor").ifPresentOrElse(
            existingDoctor -> {
                existingDoctor.setPassword(passwordEncoder.encode("doctor123"));
                existingDoctor.setRole(Role.DOCTOR);
                existingDoctor.setEnabled(true);
                userRepository.save(existingDoctor);
                log.info("Doctor user password updated - Username: doctor, Password: doctor123");
            },
            () -> {
                User doctor = User.builder()
                        .username("doctor")
                        .email("doctor@petmanagement.com")
                        .password(passwordEncoder.encode("doctor123"))
                        .firstName("Dr. John")
                        .lastName("Smith")
                        .phoneNumber("0772345678")
                        .address("Pet Clinic, Colombo")
                        .role(Role.DOCTOR)
                        .specialization("General Veterinary")
                        .availability("Monday-Friday 9AM-5PM")
                        .enabled(true)
                        .build();
                userRepository.save(doctor);
                log.info("Default doctor user created - Username: doctor, Password: doctor123");
            }
        );

        // Create or update trainer user
        userRepository.findByUsername("trainer").ifPresentOrElse(
            existingTrainer -> {
                existingTrainer.setPassword(passwordEncoder.encode("trainer123"));
                existingTrainer.setRole(Role.TRAINER);
                existingTrainer.setEnabled(true);
                userRepository.save(existingTrainer);
                log.info("Trainer user password updated - Username: trainer, Password: trainer123");
            },
            () -> {
                User trainer = User.builder()
                        .username("trainer")
                        .email("trainer@petmanagement.com")
                        .password(passwordEncoder.encode("trainer123"))
                        .firstName("Mike")
                        .lastName("Johnson")
                        .phoneNumber("0773456789")
                        .address("Pet Training Center, Colombo")
                        .role(Role.TRAINER)
                        .expertise("Dog Training, Behavior Modification")
                        .enabled(true)
                        .build();
                userRepository.save(trainer);
                log.info("Default trainer user created - Username: trainer, Password: trainer123");
            }
        );

        log.info("Data initialization completed!");
        log.info("==========================================");
        log.info("Default Login Credentials:");
        log.info("Admin   - Username: admin,   Password: admin123");
        log.info("Doctor  - Username: doctor,  Password: doctor123");
        log.info("Trainer - Username: trainer, Password: trainer123");
        log.info("==========================================");
    }
}
