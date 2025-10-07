package com.programalilian.backend.service;

import com.programalilian.backend.domain.Donation;
import com.programalilian.backend.domain.Donation.DonationType;
import com.programalilian.backend.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Implementation of DonationService.
 * Handles donation processing and validation with proper error handling.
 */
@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;

    @Override
    @Transactional
    public Donation processOneTimeDonation(String donorName, String email,
            BigDecimal amount, String transactionId) {
        // Validate inputs
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (transactionId == null || transactionId.trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction ID is required");
        }

        // Check for duplicate transaction ID
        if (donationRepository.existsByTransactionId(transactionId)) {
            throw new IllegalArgumentException("Transaction ID already exists");
        }

        // Get current timestamp for creation
        LocalDateTime now = LocalDateTime.now();

        // Create donation entity with timestamps
        Donation donation = Donation.builder()
                .donorName(donorName)
                .email(email)
                .amount(amount)
                .transactionId(transactionId)
                .type(DonationType.ONE_TIME)
                .createdAt(now)
                .updatedAt(now)
                .build();

        // Save and return
        return donationRepository.save(donation);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validatePayment(String transactionId, String status) {
        // For now, a simple validation
        // In production, this would involve webhook signature verification,
        // status checking, and business rule validation
        return "approved".equals(status) && transactionId != null;
    }
}
