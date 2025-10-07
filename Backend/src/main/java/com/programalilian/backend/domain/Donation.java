package com.programalilian.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Domain entity representing a donation made to Programa Lilian.
 * Tracks payment information for receipts and financial records.
 * Includes validation constraints for data integrity.
 */
@Entity
@Table(name = "donations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255, message = "Donor name must be less than 255 characters")
    private String donorName;

    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must be less than 255 characters")
    private String email;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Amount must have maximum 8 integer digits and 2 fraction digits")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @NotBlank(message = "Transaction ID is required")
    @Size(max = 255, message = "Transaction ID must be less than 255 characters")
    @Column(unique = true, length = 255, nullable = false)
    private String transactionId;

    @NotNull(message = "Donation type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationType type;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Enumeration for donation types.
     */
    public enum DonationType {
        ONE_TIME,
        SUBSCRIPTION
    }
}
