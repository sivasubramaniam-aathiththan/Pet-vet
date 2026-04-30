package com.petmanagement.controller;

import com.petmanagement.dto.request.AddToCartRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.CartResponse;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Cart Controller
 * 
 * Handles shopping cart operations
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    // Get user's cart
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);
        CartResponse cart = cartService.getCart(user);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        User user = getUserFromUserDetails(userDetails);
        CartResponse cart = cartService.addToCart(user, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    // Update cart item quantity
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        User user = getUserFromUserDetails(userDetails);
        CartResponse cart = cartService.updateCartItemQuantity(user, cartItemId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    // Remove item from cart
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {
        User user = getUserFromUserDetails(userDetails);
        CartResponse cart = cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    // Clear cart
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }

    // Helper method to get user from UserDetails
    private User getUserFromUserDetails(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
