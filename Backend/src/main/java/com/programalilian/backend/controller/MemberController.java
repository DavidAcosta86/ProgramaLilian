package com.programalilian.backend.controller;

import com.programalilian.backend.domain.User;
import com.programalilian.backend.dto.CreateMemberRequest;
import com.programalilian.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

/**
 * REST Controller for member management operations.
 * Handles member registration, profile updates, and subscription management.
 */
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final UserService userService;

    /**
     * Registers a new member in the system.
     *
     * @param request Member registration data
     * @return Created member with ID and timestamps
     */
    @PostMapping
    public ResponseEntity<User> registerMember(@Valid @RequestBody CreateMemberRequest request) {
        User createdUser = userService.createMember(request);
        return ResponseEntity.status(201).body(createdUser);
    }

    /**
     * Retrieves a member by their ID.
     *
     * @param id Member ID
     * @return Member data or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getMember(@PathVariable Long id) {
        // Note: This is a simple implementation. In practice, you'd want
        // proper user retrieval that checks permissions
        Optional<User> user = findUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates the payment subscription ID for a member.
     * Called after successful MercadoPago subscription creation.
     *
     * @param id             Member ID
     * @param subscriptionId MercadoPago subscription identifier
     * @return Updated member data
     */
    @PutMapping("/{id}/subscription")
    public ResponseEntity<String> updateSubscription(
            @PathVariable Long id,
            @RequestParam String subscriptionId) {

        userService.updatePaymentSubscription(id, subscriptionId);
        return ResponseEntity.ok("Subscription updated successfully");
    }

    /**
     * Helper method to find user by ID - placeholder for actual implementation.
     * In a real application, this would be implemented in the service layer.
     */
    private Optional<User> findUserById(Long id) {
        // Placeholder - this would be replaced with actual service method
        // For now, we'll return empty as we haven't implemented findById in UserService
        return Optional.empty();
    }
}
