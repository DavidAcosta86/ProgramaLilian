package com.programalilian.backend.repository;

import com.programalilian.backend.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for UserRepository using H2 in-memory database.
 * Tests JPA repository custom methods and query functionality.
 */
@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindUserByEmail() {
        // Given
        User user = User.builder()
                .fullName("Test User")
                .email("find@example.com")
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByEmail("find@example.com");

        // Then
        assertTrue(found.isPresent());
        assertEquals("Test User", found.get().getFullName());
        assertEquals("find@example.com", found.get().getEmail());
    }

    @Test
    void shouldNotFindUserByNonexistentEmail() {
        // When
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void shouldCheckIfUserExistsByEmail() {
        // Given
        User user = User.builder()
                .fullName("Existing User")
                .email("existing@example.com")
                .build();
        userRepository.save(user);

        // When & Then
        assertTrue(userRepository.existsByEmail("existing@example.com"));
        assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
    }

    @Test
    void shouldFindUsersBySubscriptionPlan() {
        // Given
        User mensualUser = User.builder()
                .fullName("Monthly User")
                .email("monthly@example.com")
                .subscriptionPlan("Mensual")
                .build();
        User trimestralUser = User.builder()
                .fullName("Quarterly User")
                .email("quarterly@example.com")
                .subscriptionPlan("Trimestral")
                .build();
        User noPlanUser = User.builder()
                .fullName("No Plan User")
                .email("noplan@example.com")
                .build();

        userRepository.save(mensualUser);
        userRepository.save(trimestralUser);
        userRepository.save(noPlanUser);

        // When
        Iterable<User> mensualUsers = userRepository.findBySubscriptionPlan("Mensual");

        // Then
        assertNotNull(mensualUsers);
        assertTrue(mensualUsers.iterator().hasNext());
        User foundUser = mensualUsers.iterator().next();
        assertEquals("Mensual", foundUser.getSubscriptionPlan());
        assertEquals("monthly@example.com", foundUser.getEmail());
    }

    @Test
    void shouldCountUsersWithActiveSubscriptions() {
        // Given
        User activeUser1 = User.builder()
                .fullName("Active User 1")
                .email("active1@example.com")
                .subscriptionId("MP_SUB_123")
                .build();
        User activeUser2 = User.builder()
                .fullName("Active User 2")
                .email("active2@example.com")
                .subscriptionId("MP_SUB_456")
                .build();
        User inactiveUser = User.builder()
                .fullName("Inactive User")
                .email("inactive@example.com")
                .build();

        userRepository.save(activeUser1);
        userRepository.save(activeUser2);
        userRepository.save(inactiveUser);

        // When
        long count = userRepository.countUsersWithActiveSubscriptions();

        // Then
        assertEquals(2, count);
    }

    @Test
    void shouldFindUserBySubscriptionId() {
        // Given
        String subscriptionId = "MP_SUB_TEST_789";
        User user = User.builder()
                .fullName("Sub User")
                .email("subuser@example.com")
                .subscriptionId(subscriptionId)
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findBySubscriptionId(subscriptionId);

        // Then
        assertTrue(found.isPresent());
        assertEquals(subscriptionId, found.get().getSubscriptionId());
        assertEquals("Sub User", found.get().getFullName());
    }

    @Test
    void shouldNotFindUserByNonexistentSubscriptionId() {
        // When
        Optional<User> found = userRepository.findBySubscriptionId("NONEXISTENT_ID");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void shouldSaveAndRetrieveUserWithAllFields() {
        // Given
        LocalDate birthDate = LocalDate.of(1990, 1, 1);
        User user = User.builder()
                .fullName("Complete User")
                .email("complete@example.com")
                .phone("+1234567890")
                .birthDate(birthDate)
                .subscriptionPlan("Anual")
                .subscriptionId("MP_SUB_COMPLETE")
                .build();

        // When
        User saved = userRepository.save(user);
        User retrieved = userRepository.findById(saved.getId()).orElseThrow();

        // Then
        assertNotNull(saved.getId());
        assertNotNull(saved.getCreatedAt());
        assertNotNull(saved.getUpdatedAt());
        assertEquals(user, retrieved); // Should be equal via lombok equals
    }
}
