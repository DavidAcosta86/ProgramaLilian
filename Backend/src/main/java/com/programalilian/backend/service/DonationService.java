package com.programalilian.backend.service;

import com.programalilian.backend.domain.Donation;

import java.math.BigDecimal;

/**
 * Service interface for donation-related business operations.
 * Handles one-time donations, payment processing, and donation management.
 */
public interface DonationService {

    /**
     * Processes a one-time donation from an anonymous donor.
     * Creates donation record with transaction details.
     *
     * @param donorName     Name of the donor (nullable for anonymous)
     * @param email         Donor email (nullable)
     * @param amount        Donation amount
     * @param transactionId MercadoPago transaction ID
     * @return Created donation record
     * @throws IllegalArgumentException if validation fails
     */
    Donation processOneTimeDonation(String donorName, String email,
            BigDecimal amount, String transactionId);

    /**
     * Validates donation payment through webhook verification.
     * Called when MercadoPago sends payment confirmation.
     *
     * @param transactionId Transaction to validate
     * @param status        Payment status from MercadoPago
     * @return True if payment was successful
     */
    boolean validatePayment(String transactionId, String status);
}
