package com.programalilian.backend.controller;

import com.programalilian.backend.domain.User;
import com.programalilian.backend.repository.DonationRepository;
import com.programalilian.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for admin operations.
 * Provides administrative endpoints for managing members and viewing
 * statistics.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    /**
     * Get all registered members.
     * Used by admin panel to display member list.
     *
     * @return List of all registered members
     */
    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembers() {
        List<User> members = userRepository.findAll();
        return ResponseEntity.ok(members);
    }

    /**
     * Get basic membership statistics.
     * Used by admin panel to display overview statistics.
     *
     * @return Membership statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getAdminStats() {
        AdminStats stats = new AdminStats(
                userRepository.count(),
                donationRepository.count(),
                donationRepository.getTotalAmountBetween(null, null) // Total all time
        );
        return ResponseEntity.ok(stats);
    }

    /**
     * Get recent members (last 50).
     * Used by admin panel to display recent registrations.
     *
     * @return List of recently registered members
     */
    @GetMapping("/members/recent")
    public ResponseEntity<List<User>> getRecentMembers() {
        // For now, return all members sorted by creation date
        // In production, you might want to limit this
        List<User> recentMembers = userRepository.findAll();
        recentMembers.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return ResponseEntity.ok(recentMembers);
    }

    /**
     * Data Transfer Object for admin statistics.
     */
    public static class AdminStats {
        public final Long totalMembers;
        public final Long totalDonations;
        public final BigDecimal totalDonationAmount;

        public AdminStats(Long totalMembers, Long totalDonations, BigDecimal totalAmount) {
            this.totalMembers = totalMembers;
            this.totalDonations = totalDonations;
            this.totalDonationAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }
    }
}
