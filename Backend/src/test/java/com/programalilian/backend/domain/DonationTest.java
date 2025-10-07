package com.programalilian.backend.domain;

import com.programalilian.backend.domain.Donation.DonationType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for Donation entity using H2 in-memory database.
 * Tests JPA persistence, validation constraints, and business rules.
 */
@DataJpaTest
@ActiveProfiles("test")
class DonationTest {

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void shouldCreateDonationWithRequiredFields() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.valueOf(100.00))
                .transactionId("TXN_123456")
                .type(DonationType.ONE_TIME)
                .build();

        // When & Then
        // Test validation
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);
        assertTrue(violations.isEmpty(), "Should have no validation errors");

        // Test persistence
        assertNull(donation.getId());
        assertNull(donation.getCreatedAt());
        assertNull(donation.getUpdatedAt());
    }

    @Test
    void shouldCreateDonationWithAllFields() {
        // Given
        Donation donation = Donation.builder()
                .donorName("María González")
                .email("maria@example.com")
                .amount(BigDecimal.valueOf(250.50))
                .transactionId("MP_TXN_789")
                .type(DonationType.SUBSCRIPTION)
                .build();

        // When & Then
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);
        assertTrue(violations.isEmpty(), "Should have no validation errors");

        assertEquals(BigDecimal.valueOf(250.50), donation.getAmount());
        assertEquals("MP_TXN_789", donation.getTransactionId());
        assertEquals(DonationType.SUBSCRIPTION, donation.getType());
        assertEquals("María González", donation.getDonorName());
        assertEquals("maria@example.com", donation.getEmail());
    }

    @Test
    void shouldValidateRequiredAmount() {
        // Given
        Donation donation = Donation.builder()
                .transactionId("TXN_123")
                .type(DonationType.ONE_TIME)
                .build(); // Missing amount

        // When
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Amount is required")));
    }

    @Test
    void shouldValidatePositiveAmount() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.ZERO)
                .transactionId("TXN_123")
                .type(DonationType.ONE_TIME)
                .build();

        // When
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("must be greater than")));
    }

    @Test
    void shouldValidateRequiredTransactionId() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.valueOf(100.00))
                .type(DonationType.ONE_TIME)
                .build(); // Missing transactionId

        // When
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Transaction ID is required")));
    }

    @Test
    void shouldValidateRequiredType() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.valueOf(100.00))
                .transactionId("TXN_123")
                .build(); // Missing type

        // When
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Donation type is required")));
    }

    @Test
    void shouldValidateEmailFormat() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.valueOf(100.00))
                .transactionId("TXN_123")
                .email("invalid-email")
                .type(DonationType.ONE_TIME)
                .build();

        // When
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("must be valid")));
    }

    @Test
    void shouldPersistDonationAndSetTimestamps() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.valueOf(150.00))
                .transactionId("PERSIST_TXN")
                .type(DonationType.ONE_TIME)
                .build();

        // When
        entityManager.persist(donation);
        entityManager.flush();

        // Then
        assertNotNull(donation.getId());
        assertNotNull(donation.getCreatedAt());
        assertNotNull(donation.getUpdatedAt());
        assertEquals(donation.getCreatedAt(), donation.getUpdatedAt());
    }

    @Test
    void shouldHandleOptionalFieldsAsNull() {
        // Given
        Donation donation = Donation.builder()
                .amount(BigDecimal.valueOf(100.00))
                .transactionId("TXN_123")
                .type(DonationType.ONE_TIME)
                .build(); // No optional fields

        // When & Then
        Set<ConstraintViolation<Donation>> violations = validator.validate(donation);
        assertTrue(violations.isEmpty(), "Should have no validation errors");
        assertNull(donation.getDonorName());
        assertNull(donation.getEmail());
    }
}
