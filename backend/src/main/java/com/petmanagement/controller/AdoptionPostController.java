package com.petmanagement.controller;

import com.petmanagement.dto.request.AdoptionPostRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.AdoptionPostResponse;
import com.petmanagement.service.AdoptionPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Adoption Post Controller
 * 
 * Handles pet adoption posts
 */
@RestController
@RequestMapping("/api/adoption")
@RequiredArgsConstructor
public class AdoptionPostController {

    private final AdoptionPostService adoptionPostService;

    // Get all approved posts (public)
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<AdoptionPostResponse>>> getApprovedPosts() {
        List<AdoptionPostResponse> posts = adoptionPostService.getApprovedPosts();
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    // Get pending posts (Admin only)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdoptionPostResponse>>> getPendingPosts() {
        List<AdoptionPostResponse> posts = adoptionPostService.getPendingPosts();
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    // Get user's posts
    @GetMapping("/my-posts")
    public ResponseEntity<ApiResponse<List<AdoptionPostResponse>>> getUserPosts(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        List<AdoptionPostResponse> posts = adoptionPostService.getPostsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    // Submit adoption post
    @PostMapping
    public ResponseEntity<ApiResponse<AdoptionPostResponse>> submitPost(
            @Valid @RequestBody AdoptionPostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        AdoptionPostResponse post = adoptionPostService.submitPost(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Adoption post submitted successfully", post));
    }

    // Approve post (Admin only)
    @PutMapping("/{postId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdoptionPostResponse>> approvePost(@PathVariable Long postId) {
        AdoptionPostResponse post = adoptionPostService.approvePost(postId);
        return ResponseEntity.ok(ApiResponse.success("Post approved successfully", post));
    }

    // Reject post (Admin only)
    @PutMapping("/{postId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdoptionPostResponse>> rejectPost(@PathVariable Long postId) {
        AdoptionPostResponse post = adoptionPostService.rejectPost(postId);
        return ResponseEntity.ok(ApiResponse.success("Post rejected", post));
    }

    // Delete post
    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        adoptionPostService.deletePost(postId, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully"));
    }

    // Helper method to extract user ID from UserDetails
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        return Long.parseLong(userDetails.getUsername());
    }
}
