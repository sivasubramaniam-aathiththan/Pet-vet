package com.petmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application Class
 * Pet Management System - ITP Project
 * 
 * This application provides a comprehensive pet management solution with:
 * - User authentication and role-based access control
 * - Pet management (CRUD operations)
 * - Doctor appointment booking
 * - Vaccination tracking with alerts
 * - Expense tracking per pet
 * - Pet adoption module
 * - Trainer packages
 * - E-commerce product suggestions
 */
@SpringBootApplication
public class PetManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetManagementApplication.class, args);
        System.out.println("==========================================");
        System.out.println("Pet Management System Started Successfully!");
        System.out.println("Server running on: http://localhost:8080");
        System.out.println("==========================================");
    }
}
