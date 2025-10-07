package com.programalilian.backend.domain;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.EntityManager;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for User entity using H2 in-memory database.
 * Tests JPA persistence and entity integrity following TDD principles.
 */
@DataJpaTest
@ActiveProfiles("test")
class UserTest {

    @Autowired
    private EntityManager entityManager;

    @Test
    void shouldCreateUserWithRequiredFields() {
        // Given
        String fullName = "María González";
        String email = "maria.gonzalez@example.com";

        // When
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .build();

        // Then
        assertEquals(fullName, user.getFullName());
        assertEquals(email, user.getEmail());
        assertNull(user.getId()); // Not set until persisted
        assertNull(user.getCreatedAt()); // Set by @PrePersist
        assertNull(user.getUpdatedAt()); // Set by @PrePersist
    }

    @Test
    void shouldCreateUserWithOptionalFields() {
        // Given
        LocalDate birthDate = LocalDate.of(1985, 5, 15);
        String phone = "+541123456789";
        String subscriptionPlan = "Mensual";

        // When
        User user = User.builder()
                .fullName("Juan Pérez")
                .email("juan.perez@example.com")
                .phone(phone)
                .birthDate(birthDate)
                .subscriptionPlan(subscriptionPlan)
                .subscriptionId("MP_SUB_ID_123")
                .build();

        // Then
        assertEquals(phone, user.getPhone());
        assertEquals(birthDate, user.getBirthDate());
        assertEquals(subscriptionPlan, user.getSubscriptionPlan());
        assertEquals("MP_SUB_ID_123", user.getSubscriptionId());
    }

    @Test
    void shouldUpdateTimestampsWhenPersisted() {
        // Given
        User user = User.builder()
                .fullName("Test User")
                .email("persist@example.com")
                .build();

        // When - persist and then update
        entityManager.persist(user);
        entityManager.flush();

        LocalDateTime createdAt = user.getCreatedAt();
        LocalDateTime updatedAt = user.getUpdatedAt();
        assertNotNull(createdAt);
        assertEquals(createdAt, updatedAt); // Same after initial creation

        // Simulate update by changing field and flushing
        user.setFullName("Updated Name");
        entityManager.flush();

        // Then - updatedAt should be later than createdAt
        assertEquals(createdAt, user.getCreatedAt());
        assertTrue(user.getUpdatedAt().isAfter(createdAt));
        assertTrue(user.getUpdatedAt().isAfter(updatedAt));
    }

    @Test
    void shouldHandleNullOptionalFields() {
        // Given
        User user = User.builder()
                .fullName("Test User")
                .email("test@example.com")
                .build();

        // Then
        assertNull(user.getPhone());
        assertNull(user.getBirthDate());
        assertNull(user.getSubscriptionPlan());
        assertNull(user.getSubscriptionId());
    }

    @Test
    void shouldPersistUserAndSetTimestamps() {
        // Given
        User user = User.builder()
                .fullName("Persist Test")
                .email("persist@example.com")
                .build();

        // When
        entityManager.persist(user);
        entityManager.flush();

        // Then
        assertNotNull(user.getId());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
        assertEquals(user.getCreatedAt(), user.getUpdatedAt()); // Initially same after creation
    }
}
