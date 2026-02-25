package com.petmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Adoption Post Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdoptionPostResponse {
    private Long postId;
    private String petDetails;
    private String location;
    private String contactNumber;
    private String petImage;
    private String status;
    private String petType;
    private String age;
    private String gender;
    private String description;
    
    // User info
    private Long userId;
    private String submittedBy;
    
    private LocalDateTime createdAt;
}