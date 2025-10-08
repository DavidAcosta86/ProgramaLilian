package com.programalilian.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security configuration for development and production environments.
 *
 * For LOCAL development: Allows public access to all endpoints
 * For production: Full OAuth2/Google authentication (to be implemented)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        /**
         * Local development configuration: No authentication required
         * Allows public access to all endpoints for easy testing
         */
        @Bean
        @Profile("local")
        public SecurityFilterChain localSecurityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable()) // Disable CSRF for easy API testing
                                .cors(c -> c.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers("/", "/api/**", "/swagger-ui/**", "/swagger-ui.html",
                                                                "/api-docs/**", "/actuator/**")
                                                .permitAll()
                                                .anyRequest().permitAll() // Allow all for development
                                );

                return http.build();
        }

        /**
         * Production configuration with OAuth2 (to be implemented)
         * This will enforce authentication for most endpoints
         */
        @Bean
        @Profile("!local")
        public SecurityFilterChain productionSecurityFilterChain(HttpSecurity http) throws Exception {
                // TODO: Implement OAuth2 Google authentication when needed
                // For now, allow all requests (same as local)
                http
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(authz -> authz
                                                .anyRequest().permitAll());

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(Arrays.asList("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
