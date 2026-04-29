package com.petcare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Recipient (Specific User)
    private String targetRole; // Recipient Role ('VET' or 'OWNER' for broadcasts)
    private Long petId;
    private String petName;
    
    private String title;
    private String message;
    private String text; // Legacy field for old records
    private String type; // 'UPCOMING', 'OVERDUE', 'MEDICATION', 'SYSTEM'
    
    private LocalDateTime createdAt;
    private boolean readStatus = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
