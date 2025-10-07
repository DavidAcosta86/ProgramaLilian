package com.programalilian.backend.service;

import com.programalilian.backend.domain.User;
import com.programalilian.backend.dto.CreateMemberRequest;
import com.programalilian.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Implementation of UserService.
 * Handles member-related business logic with proper validation and error
 * handling.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public User createMember(CreateMemberRequest request) {
        // Check email uniqueness
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("El email ya está registrado");
        }

        // Create user entity
        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .birthDate(request.birthDate())
                .build();

        // Save and return
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public void updatePaymentSubscription(Long userId, String subscriptionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + userId));

        // Update subscription info
        user.setSubscriptionId(subscriptionId);

        userRepository.save(user);
    }
}
