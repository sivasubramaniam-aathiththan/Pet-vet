package com.petmanagement.service;

import com.petmanagement.dto.request.ProductRequest;
import com.petmanagement.dto.response.ProductResponse;
import com.petmanagement.entity.Product;
import com.petmanagement.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Product Service
 * 
 * Handles pet product suggestions (e-commerce)
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Get all active products (public)
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findAllActiveProducts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all products (Admin only)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get product by ID
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }

    // Get products by category
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndActive(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Search products by name
    public List<ProductResponse> searchProducts(String name) {
        return productRepository.searchByName(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add product (Admin only)
    @Transactional
    public ProductResponse addProduct(ProductRequest request) {
        Product product = Product.builder()
                .productName(request.getProductName())
                .description(request.getDescription())
                .externalEcommerceLink(request.getExternalEcommerceLink())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .brand(request.getBrand())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .isActive(true)
                .build();

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    // Update product (Admin only)
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setExternalEcommerceLink(request.getExternalEcommerceLink());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        // Always update stockQuantity (even if it's 0)
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    // Delete product (Admin only)
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    // Toggle product active status (Admin only)
    @Transactional
    public ProductResponse toggleProductStatus(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(!product.getIsActive());
        product = productRepository.save(product);
        return mapToResponse(product);
    }

    // Get all categories
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    // Map entity to response DTO
    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .externalEcommerceLink(product.getExternalEcommerceLink())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .brand(product.getBrand())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
