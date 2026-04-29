package com.petcare.backend.service;

import com.petcare.backend.entity.Product;
import com.petcare.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(product.getName());
            existing.setDescription(product.getDescription());
            existing.setPrice(product.getPrice());
            existing.setStockQuantity(product.getStockQuantity());
            existing.setImageUrl(product.getImageUrl());
            existing.setCategory(product.getCategory());
            if (product.getIsActive() != null) {
                existing.setIsActive(product.getIsActive());
            }
            return productRepository.save(existing);
        }
        return null;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product toggleStatus(Long id) {
        Product product = getProductById(id);
        if (product != null) {
            product.setIsActive(!Boolean.TRUE.equals(product.getIsActive()));
            return productRepository.save(product);
        }
        return null;
    }

    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .filter(c -> c != null && !c.isEmpty())
                .distinct()
                .toList();
    }
}
