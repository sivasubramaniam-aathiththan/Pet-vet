package com.petmanagement.controller;

import com.petmanagement.dto.request.PlaceOrderRequest;
import com.petmanagement.dto.request.UpdateOrderStatusRequest;
import com.petmanagement.dto.response.ApiResponse;
import com.petmanagement.dto.response.OrderResponse;
import com.petmanagement.entity.OrderStatus;
import com.petmanagement.entity.User;
import com.petmanagement.repository.UserRepository;
import com.petmanagement.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Order Controller
 * 
 * Handles order operations
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    // Place order
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PlaceOrderRequest request) {
        User user = getUserFromUserDetails(userDetails);
        OrderResponse order = orderService.placeOrder(user, request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    // Get user's orders
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);
        List<OrderResponse> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable Long orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    // Get all orders (Admin only)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // Get orders by status (Admin only)
    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStatus(
            @PathVariable OrderStatus status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // Update order status (Admin only)
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    // Helper method to get user from UserDetails
    private User getUserFromUserDetails(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
