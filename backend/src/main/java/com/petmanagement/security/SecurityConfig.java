package com.petmanagement.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security Configuration
 * 
 * Configures Spring Security with JWT authentication
 * Defines role-based access control for all endpoints
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    // Password encoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication provider
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Authentication manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Security filter chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (not needed for stateless JWT)
                .csrf(AbstractHttpConfigurer::disable)
                
                // Configure authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - Authentication
                        .requestMatchers("/api/auth/**").permitAll()
                        
                        // Public endpoints - View approved adoption posts
                        .requestMatchers(HttpMethod.GET, "/api/adoption/approved").permitAll()
                        
                        // Public endpoints - View active trainer packages
                        .requestMatchers(HttpMethod.GET, "/api/trainer-packages/active").permitAll()
                        
                        // Public endpoints - View active products
                        .requestMatchers(HttpMethod.GET, "/api/products/active").permitAll()
                        
                        // Admin only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // Doctor endpoints
                        .requestMatchers("/api/doctor/**").hasAnyRole("DOCTOR", "ADMIN")
                        
                        // Trainer endpoints
                        .requestMatchers("/api/trainer/**").hasAnyRole("TRAINER", "ADMIN")
                        
                        // User endpoints (also accessible by ADMIN)
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/pets/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/appointments/**").hasAnyRole("USER", "DOCTOR", "ADMIN")
                        .requestMatchers("/api/vaccinations/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/expenses/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/adoption/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/trainer-packages/**").hasAnyRole("TRAINER", "USER", "ADMIN")
                        .requestMatchers("/api/products/**").hasAnyRole("ADMIN")
                        
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                
                // Set session management to stateless
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Set authentication provider
                .authenticationProvider(authenticationProvider())
                
                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
