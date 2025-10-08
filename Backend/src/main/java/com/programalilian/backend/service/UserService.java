package com.programalilian.backend.service;

import com.programalilian.backend.domain.User;
import com.programalilian.backend.dto.CreateMemberRequest;
import java.util.Optional;

/**
 * Service interface for user-related business operations.
 * Handles member registration, payments, and subscriptions.
 */
public interface UserService {

    /**
     * Creates a new member with the provided information.
     * Validates data, checks uniqueness, and saves the member.
     *
     * @param request The member creation request
     * @return The created member entity
     * @throws IllegalArgumentException if validation fails
     * @throws IllegalStateException    if email already exists
     */
    User createMember(CreateMemberRequest request);

    /**
     * Finds a member by their email address.
     *
     * @param email The email to search for
     * @return The member if found, otherwise empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Updates the payment subscription for an existing member.
     *
     * @param userId         The member ID
     * @param subscriptionId The MercadoPago subscription identifier
     * @throws IllegalArgumentException if user not found or invalid data
     */
    void updatePaymentSubscription(Long userId, String subscriptionId);

    /**
     * Finds a member by their ID.
     *
     * @param id The member ID
     * @return The member if found, otherwise empty
     */
    Optional<User> findById(Long id);

    /**
     * Saves a user entity.
     *
     * @param user The user to save
     * @return The saved user
     */
    User save(User user);
}
