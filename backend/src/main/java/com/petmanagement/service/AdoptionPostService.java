package com.petmanagement.service;

import com.petmanagement.dto.request.AdoptionPostRequest;
import com.petmanagement.dto.response.AdoptionPostResponse;
import com.petmanagement.entity.AdoptionPost;
import com.petmanagement.entity.User;
import com.petmanagement.repository.AdoptionPostRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Adoption Post Service
 * 
 * Handles pet adoption posts
 */
@Service
@RequiredArgsConstructor
public class AdoptionPostService {

    private final AdoptionPostRepository adoptionPostRepository;
    private final UserRepository userRepository;

    // Get all approved posts (public)
    public List<AdoptionPostResponse> getApprovedPosts() {
        return adoptionPostRepository.findAllApprovedPosts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get pending posts (Admin only)
    public List<AdoptionPostResponse> getPendingPosts() {
        return adoptionPostRepository.findAllPendingPosts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get posts by user
    public List<AdoptionPostResponse> getPostsByUser(Long userId) {
        return adoptionPostRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Submit adoption post
    @Transactional
    public AdoptionPostResponse submitPost(AdoptionPostRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdoptionPost post = AdoptionPost.builder()
                .petDetails(request.getPetDetails())
                .location(request.getLocation())
                .contactNumber(request.getContactNumber())
                .petImage(request.getPetImage())
                .petType(request.getPetType())
                .age(request.getAge())
                .gender(request.getGender())
                .description(request.getDescription())
                .status("PENDING")
                .user(user)
                .build();

        post = adoptionPostRepository.save(post);
        return mapToResponse(post);
    }

    // Approve post (Admin only)
    @Transactional
    public AdoptionPostResponse approvePost(Long postId) {
        AdoptionPost post = adoptionPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setStatus("APPROVED");
        post = adoptionPostRepository.save(post);
        return mapToResponse(post);
    }

    // Reject post (Admin only)
    @Transactional
    public AdoptionPostResponse rejectPost(Long postId) {
        AdoptionPost post = adoptionPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setStatus("REJECTED");
        post = adoptionPostRepository.save(post);
        return mapToResponse(post);
    }

    // Delete post
    @Transactional
    public void deletePost(Long postId, Long userId, boolean isAdmin) {
        AdoptionPost post = adoptionPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!isAdmin && !post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        adoptionPostRepository.delete(post);
    }

    // Map entity to response DTO
    private AdoptionPostResponse mapToResponse(AdoptionPost post) {
        return AdoptionPostResponse.builder()
                .postId(post.getPostId())
                .petDetails(post.getPetDetails())
                .location(post.getLocation())
                .contactNumber(post.getContactNumber())
                .petImage(post.getPetImage())
                .status(post.getStatus())
                .petType(post.getPetType())
                .age(post.getAge())
                .gender(post.getGender())
                .description(post.getDescription())
                .userId(post.getUser().getUserId())
                .submittedBy(post.getUser().getFirstName() + " " + post.getUser().getLastName())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
