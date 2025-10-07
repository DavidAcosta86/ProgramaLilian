package com.programalilian.backend.controller;

import com.programalilian.backend.domain.Donation;
import com.programalilian.backend.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * REST Controller for donation management operations.
 * Handles one-time donation processing and webhook payments.
 */
@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    /**
     * Processes a one-time donation.
     * Typically called from the donation form on frontend.
     *
     * @param donorName     Name of the donor (optional)
     * @param email         Email of the donor (optional)
     * @param amount        Donation amount
     * @param transactionId MercadoPago transaction ID
     * @return Created donation record
     */
    @PostMapping
    public ResponseEntity<Donation> processDonation(
            @RequestParam(required = false) String donorName,
            @RequestParam(required = false) String email,
            @RequestParam @NotNull @Positive BigDecimal amount,
            @RequestParam @NotBlank String transactionId) {

        Donation donation = donationService.processOneTimeDonation(
                donorName, email, amount, transactionId);

        return ResponseEntity.status(201).body(donation);
    }

    /**
     * Webhook endpoint for MercadoPago payment confirmations.
     * Called by MercadoPago when a payment status changes.
     *
     * @param transactionId Transaction to validate
     * @param status        Payment status
     * @return HTTP 200 confirmation
     */
    @PostMapping("/webhook/{transactionId}")
    public ResponseEntity<String> handlePaymentWebhook(
            @PathVariable String transactionId,
            @RequestParam String status) {

        boolean isValid = donationService.validatePayment(transactionId, status);

        if (isValid) {
            // In production, this would trigger email notifications,
            // receipt generation, and other post-payment processes
            return ResponseEntity.ok("Payment validated successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid payment data");
        }
    }

    /**
     * Gets donation statistics (placeholder for future analytics).
     * Could return total amounts, counts by type, etc.
     *
     * @return Basic statistics message
     */
    @GetMapping("/stats")
    public ResponseEntity<String> getDonationStats() {
        // Placeholder - would return actual statistics
        return ResponseEntity.ok("Donation analytics will be available soon");
    }
}
