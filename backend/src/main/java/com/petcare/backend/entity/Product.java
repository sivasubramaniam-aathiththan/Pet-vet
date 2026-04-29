package com.petcare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 500)
    private String description;
    
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private String category; // e.g., FOOD, TOYS, ACCESSORIES, MEDICINE
    private Boolean isActive = true;
}
