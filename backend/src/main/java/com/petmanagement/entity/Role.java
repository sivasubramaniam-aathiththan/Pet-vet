package com.petmanagement.entity;

/**
 * User Roles Enum
 * 
 * Defines the four user roles in the system:
 * - ADMIN: Full system control, can manage doctors, trainers, and approve adoption posts
 * - USER: Regular users who can manage their pets, book appointments, etc.
 * - DOCTOR: Can view appointments and manage their availability
 * - TRAINER: Can add training packages for users to view
 */
public enum Role {
    ADMIN,
    USER,
    DOCTOR,
    TRAINER
}
