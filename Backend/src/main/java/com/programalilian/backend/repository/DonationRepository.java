package com.programalilian.backend.repository;

import com.programalilian.backend.domain.Donation;
import com.programalilian.backend.domain.Donation.DonationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Donation entity operations.
 * Extends JpaRepository for basic CRUD operations and adds custom queries.
 */
@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

        /**
         * Find donation by MercadoPago transaction ID.
         * 
         * @param transactionId Transaction identifier from MercadoPago
         * @return Optional containing donation if found
         */
        Optional<Donation> findByTransactionId(String transactionId);

        /**
         * Check if donation exists by transaction ID.
         * 
         * @param transactionId Transaction ID to check
         * @return true if donation exists, false otherwise
         */
        boolean existsByTransactionId(String transactionId);

        /**
         * Find donations by type (ONE_TIME or SUBSCRIPTION).
         * 
         * @param type Donation type
         * @return List of donations matching the type
         */
        List<Donation> findByType(DonationType type);

        /**
         * Find donations by email (for receipts and user history).
         * 
         * @param email Donor email
         * @return List of donations by this email
         */
        List<Donation> findByEmail(String email);

        /**
         * Calculate total amount donated between dates.
         *
         * @param startDate Start of period
         * @param endDate   End of period
         * @return Total amount as BigDecimal
         */
        @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.createdAt >= :startDate AND d.createdAt <= :endDate")
        BigDecimal getTotalAmountBetween(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Count donations by type within date range.
         * 
         * @param type      Donation type
         * @param startDate Start date
         * @param endDate   End date
         * @return Number of donations
         */
        @Query("SELECT COUNT(d) FROM Donation d WHERE d.type = :type AND d.createdAt BETWEEN :startDate AND :endDate")
        long countByTypeAndDateBetween(@Param("type") DonationType type,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Find recent donations for a specific email.
         * 
         * @param email Donor email
         * @param limit Maximum number of results
         * @return List of recent donations ordered by creation date desc
         */
        @Query("SELECT d FROM Donation d WHERE d.email = :email ORDER BY d.createdAt DESC")
        List<Donation> findRecentByEmail(@Param("email") String email,
                        org.springframework.data.domain.Pageable pageable);
}
