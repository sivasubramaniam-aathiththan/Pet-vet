package com.petcare.backend.controller;

import com.petcare.backend.entity.ServiceListing;
import com.petcare.backend.repository.ServiceListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing professional pet services such as Grooming, Training, and Veterinary care.
 */
@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*")
public class ServiceListingController {

    @Autowired
    private ServiceListingRepository listingRepository;

    /**
     * Retrieves all registered service listings across all categories.
     */
    @GetMapping
    public List<ServiceListing> getAllListings() {
        return listingRepository.findAll();
    }

    /**
     * Filters service listings by specific categories (e.g., Veterinary, Grooming).
     */
    @GetMapping("/category/{category}")
    public List<ServiceListing> getByCategory(@PathVariable String category) {
        return listingRepository.findByCategory(category);
    }

    /**
     * Publishes a new professional service listing to the platform directory.
     */
    @PostMapping
    public ServiceListing createListing(@RequestBody ServiceListing listing) {
        return listingRepository.save(listing);
    }

    /**
     * Updates details for an existing professional service listing.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ServiceListing> updateListing(@PathVariable Long id, @RequestBody ServiceListing updated) {
        return listingRepository.findById(id).map(listing -> {
            listing.setTitle(updated.getTitle());
            listing.setDescription(updated.getDescription());
            listing.setPrice(updated.getPrice());
            listing.setCategory(updated.getCategory());
            listing.setImageUrl(updated.getImageUrl());
            return ResponseEntity.ok(listingRepository.save(listing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently deletes a service listing from the platform.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggles the visibility status of a service listing for administrative curation.
     */
    @PutMapping("/{id}/toggle")
    public ResponseEntity<ServiceListing> toggleListing(@PathVariable Long id) {
        return listingRepository.findById(id).map(listing -> {
            boolean current = listing.getIsActive() != null && listing.getIsActive();
            listing.setIsActive(!current);
            return ResponseEntity.ok(listingRepository.save(listing));
        }).orElse(ResponseEntity.notFound().build());
    }
}
