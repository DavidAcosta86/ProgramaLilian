package com.programalilian.backend.service;

import com.programalilian.backend.domain.User;
import com.programalilian.backend.dto.CreateMemberRequest;
import com.programalilian.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService following TDD principles.
 * Tests business logic using mocks and verifies service behavior.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void shouldCreateMemberSuccessfully() {
        // Given
        CreateMemberRequest request = new CreateMemberRequest(
                "María González", "maria@example.com", "+541123456789", LocalDate.of(1980, 5, 15));

        User savedUser = User.builder()
                .fullName("María González")
                .email("maria@example.com")
                .phone("+541123456789")
                .birthDate(LocalDate.of(1980, 5, 15))
                .build();
        savedUser.setId(1L);

        when(userRepository.existsByEmail("maria@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.createMember(request);

        // Then
        assertNotNull(result);
        assertEquals("María González", result.getFullName());
        assertEquals("maria@example.com", result.getEmail());
        assertEquals(1L, result.getId());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        // Given
        CreateMemberRequest request = new CreateMemberRequest(
                "María González", "existing@example.com", null, null);

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> userService.createMember(request));

        assertEquals("El email ya está registrado", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldFindUserByEmail() {
        // Given
        String email = "find@example.com";
        User user = User.builder()
                .fullName("Found User")
                .email(email)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        Optional<User> result = userService.findByEmail(email);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Found User", result.get().getFullName());
        assertEquals(email, result.get().getEmail());
    }

    @Test
    void shouldReturnEmptyOptionalWhenUserNotFound() {
        // Given
        String email = "notfound@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByEmail(email);

        // Then
        assertFalse(result.isPresent());
    }

    @Test
    void shouldUpdatePaymentSubscriptionSuccessfully() {
        // Given
        Long userId = 1L;
        String subscriptionId = "MP_SUB_123";
        User user = User.builder()
                .fullName("Test User")
                .email("test@example.com")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        // When
        userService.updatePaymentSubscription(userId, subscriptionId);

        // Then
        assertEquals(subscriptionId, user.getSubscriptionId());
        verify(userRepository).save(user);
    }

    @Test
    void shouldThrowExceptionWhenUserNotFoundForSubscriptionUpdate() {
        // Given
        Long userId = 999L;
        String subscriptionId = "MP_SUB_123";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> userService.updatePaymentSubscription(userId, subscriptionId));

        assertEquals("Usuario no encontrado: 999", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
