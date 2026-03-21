package com.petmanagement.service;

import com.petmanagement.dto.request.AddToCartRequest;
import com.petmanagement.dto.response.CartItemResponse;
import com.petmanagement.dto.response.CartResponse;
import com.petmanagement.entity.Cart;
import com.petmanagement.entity.CartItem;
import com.petmanagement.entity.Product;
import com.petmanagement.entity.User;
import com.petmanagement.repository.CartItemRepository;
import com.petmanagement.repository.CartRepository;
import com.petmanagement.repository.ProductRepository;
import com.petmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Cart Service
 * 
 * Handles shopping cart operations
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Get or create cart for user
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .build();
                    return cartRepository.save(cart);
                });
    }

    // Get cart for user
    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    // Add item to cart
    @Transactional
    public CartResponse addToCart(User user, AddToCartRequest request) {
        // Validate request
        if (request.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        Cart cart = getOrCreateCart(user);
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + request.getProductId()));
        
        // Check if product is active
        if (product.getIsActive() == null || !product.getIsActive()) {
            throw new RuntimeException("Product is not available");
        }
        
        // Check if product has price
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new RuntimeException("Product does not have a valid price");
        }
        
        // Stock check - only enforce if stockQuantity is set and greater than 0
        // Products with null or 0 stock can still be added (e.g., external e-commerce links)
        Integer stockQty = product.getStockQuantity();
        if (stockQty != null && stockQty > 0 && stockQty < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + stockQty);
        }
        
        // Check if item already in cart
        CartItem existingItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);
        
        if (existingItem != null) {
            // Update quantity
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            Integer existingStock = product.getStockQuantity();
            if (existingStock != null && existingStock > 0 && existingStock < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + existingStock);
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // Create new cart item
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            cartItemRepository.save(cartItem);
        }
        
        // Refresh cart to get updated items
        cart = cartRepository.findById(cart.getCartId()).orElse(cart);
        return mapToCartResponse(cart);
    }

    // Update cart item quantity
    @Transactional
    public CartResponse updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        // Verify cart belongs to user
        if (!cartItem.getCart().getCartId().equals(cart.getCartId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }
        
        // Check stock - only enforce if stockQuantity is set
        Product product = cartItem.getProduct();
        Integer stockQty = product.getStockQuantity();
        if (stockQty != null && stockQty > 0 && stockQty < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + stockQty);
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        
        return mapToCartResponse(cart);
    }

    // Remove item from cart
    @Transactional
    public CartResponse removeFromCart(User user, Long cartItemId) {
        Cart cart = getOrCreateCart(user);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        // Verify cart belongs to user
        if (!cartItem.getCart().getCartId().equals(cart.getCartId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }
        
        cartItemRepository.delete(cartItem);
        
        return mapToCartResponse(cart);
    }

    // Clear cart
    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cartItemRepository.deleteByCart(cart);
    }

    // Map cart to response
    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> cartItems = cart.getCartItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());
        
        return CartResponse.builder()
                .cartId(cart.getCartId())
                .cartItems(cartItems)
                .totalAmount(cart.getTotalAmount())
                .totalItemCount(cart.getTotalItemCount())
                .build();
    }

    // Map cart item to response
    private CartItemResponse mapToCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .cartItemId(item.getCartItemId())
                .productId(item.getProduct().getProductId())
                .productName(item.getProduct().getProductName())
                .productImageUrl(item.getProduct().getImageUrl())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .addedAt(item.getProduct().getCreatedAt())
                .build();
    }
}
