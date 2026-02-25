package com.petmanagement.repository;

import com.petmanagement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Product Repository
 * 
 * Handles database operations for Product entity
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find all active products
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findAllActiveProducts();
    
    // Find products by category
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.isActive = true")
    List<Product> findByCategoryAndActive(@Param("category") String category);
    
    // Find products by brand
    @Query("SELECT p FROM Product p WHERE p.brand = :brand AND p.isActive = true")
    List<Product> findByBrandAndActive(@Param("brand") String brand);
    
    // Search products by name
    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%')) AND p.isActive = true")
    List<Product> searchByName(@Param("name") String name);
    
    // Find products by price range
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.isActive = true")
    List<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    // Find distinct categories
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.isActive = true AND p.category IS NOT NULL")
    List<String> findAllCategories();
    
    // Find distinct brands
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true AND p.brand IS NOT NULL")
    List<String> findAllBrands();
    
    // Count active products
    long countByIsActiveTrue();
}
