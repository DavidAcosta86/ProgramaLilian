package com.programalilian.backend.repository;

import com.programalilian.backend.domain.Donation;
import com.programalilian.backend.domain.Donation.DonationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for DonationRepository using H2 in-memory database.
 * Tests JPA repository custom methods and query functionality.
 */
@DataJpaTest
@ActiveProfiles("test")
class DonationRepositoryTest {

        @Autowired
        private DonationRepository donationRepository;

        @Test
        void shouldFindDonationByTransactionId() {
                // Given
                Donation donation = Donation.builder()
                                .amount(BigDecimal.valueOf(100.00))
                                .transactionId("TXN_FIND_123")
                                .type(DonationType.ONE_TIME)
                                .build();
                donationRepository.save(donation);

                // When
                Optional<Donation> found = donationRepository.findByTransactionId("TXN_FIND_123");

                // Then
                assertTrue(found.isPresent());
                assertEquals(BigDecimal.valueOf(100.00), found.get().getAmount());
                assertEquals("TXN_FIND_123", found.get().getTransactionId());
        }

        @Test
        void shouldNotFindDonationByNonexistentTransactionId() {
                // When
                Optional<Donation> found = donationRepository.findByTransactionId("NONEXISTENT_TXN");

                // Then
                assertFalse(found.isPresent());
        }

        @Test
        void shouldCheckIfDonationExistsByTransactionId() {
                // Given
                Donation donation = Donation.builder()
                                .amount(BigDecimal.valueOf(50.00))
                                .transactionId("TXN_EXISTS_456")
                                .type(DonationType.ONE_TIME)
                                .build();
                donationRepository.save(donation);

                // When & Then
                assertTrue(donationRepository.existsByTransactionId("TXN_EXISTS_456"));
                assertFalse(donationRepository.existsByTransactionId("TXN_NOT_EXISTS"));
        }

        @Test
        void shouldFindDonationsByType() {
                // Given
                Donation oneTimeDonation = Donation.builder()
                                .amount(BigDecimal.valueOf(200.00))
                                .transactionId("TXN_ONE_TIME")
                                .type(DonationType.ONE_TIME)
                                .build();
                Donation subscriptionDonation = Donation.builder()
                                .amount(BigDecimal.valueOf(150.00))
                                .transactionId("TXN_SUBSCRIPTION")
                                .type(DonationType.SUBSCRIPTION)
                                .build();

                donationRepository.save(oneTimeDonation);
                donationRepository.save(subscriptionDonation);

                // When
                List<Donation> oneTimeDonations = donationRepository.findByType(DonationType.ONE_TIME);
                List<Donation> subscriptionDonations = donationRepository.findByType(DonationType.SUBSCRIPTION);

                // Then
                assertEquals(1, oneTimeDonations.size());
                assertEquals(BigDecimal.valueOf(200.00), oneTimeDonations.get(0).getAmount());
                assertEquals(DonationType.ONE_TIME, oneTimeDonations.get(0).getType());

                assertEquals(1, subscriptionDonations.size());
                assertEquals(BigDecimal.valueOf(150.00), subscriptionDonations.get(0).getAmount());
                assertEquals(DonationType.SUBSCRIPTION, subscriptionDonations.get(0).getType());
        }

        @Test
        void shouldFindDonationsByEmail() {
                // Given
                String testEmail = "donor@example.com";
                Donation donation1 = Donation.builder()
                                .amount(BigDecimal.valueOf(100.00))
                                .transactionId("TXN_EMAIL_1")
                                .email(testEmail)
                                .type(DonationType.ONE_TIME)
                                .build();
                Donation donation2 = Donation.builder()
                                .amount(BigDecimal.valueOf(50.00))
                                .transactionId("TXN_EMAIL_2")
                                .email(testEmail)
                                .type(DonationType.ONE_TIME)
                                .build();
                Donation otherDonation = Donation.builder()
                                .amount(BigDecimal.valueOf(75.00))
                                .transactionId("TXN_EMAIL_3")
                                .email("other@example.com")
                                .type(DonationType.ONE_TIME)
                                .build();

                donationRepository.save(donation1);
                donationRepository.save(donation2);
                donationRepository.save(otherDonation);

                // When
                List<Donation> donations = donationRepository.findByEmail(testEmail);

                // Then
                assertEquals(2, donations.size());
                donations.forEach(donation -> assertEquals(testEmail, donation.getEmail()));
        }

        @Test
        void shouldGetTotalAmountBetweenDates() {
                // Given - Use current date for the in-range donation and past date for
                // out-of-range
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime startDate = now.minusDays(1);
                LocalDateTime endDate = now.plusDays(1);

                // Donation within range (set current date timestamps)
                Donation inRangeDonation = new Donation();
                inRangeDonation.setAmount(BigDecimal.valueOf(200.00));
                inRangeDonation.setTransactionId("TXN_RANGE_1");
                inRangeDonation.setCreatedAt(now); // current date
                inRangeDonation.setUpdatedAt(now);
                inRangeDonation.setType(DonationType.ONE_TIME);
                donationRepository.saveAndFlush(inRangeDonation);

                // Donation outside range (manually set old date to test filtering)
                Donation outOfRangeDonation = new Donation();
                outOfRangeDonation.setAmount(BigDecimal.valueOf(100.00));
                outOfRangeDonation.setTransactionId("TXN_RANGE_2");
                outOfRangeDonation.setCreatedAt(now.minusDays(5)); // 5 days ago - outside range
                outOfRangeDonation.setUpdatedAt(now.minusDays(5));
                outOfRangeDonation.setType(DonationType.ONE_TIME);
                donationRepository.saveAndFlush(outOfRangeDonation);

                // When - query between yesterday and tomorrow
                BigDecimal total = donationRepository.getTotalAmountBetween(startDate, endDate);

                // Then - should only include the in-range donation
                assertEquals(0, BigDecimal.valueOf(200.00).compareTo(total));
        }

        @Test
        void shouldCountByTypeAndDateBetween() {
                // Given
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime yesterday = now.minusDays(1);
                LocalDateTime tomorrow = now.plusDays(1);

                // ONE_TIME donation in range
                Donation oneTimeInRange = Donation.builder()
                                .amount(BigDecimal.valueOf(100.00))
                                .transactionId("TXN_COUNT_ONE_TIME")
                                .type(DonationType.ONE_TIME)
                                .createdAt(now)
                                .updatedAt(now)
                                .build();
                donationRepository.save(oneTimeInRange);

                // SUBSCRIPTION donation in range
                Donation subscriptionInRange = Donation.builder()
                                .amount(BigDecimal.valueOf(75.00))
                                .transactionId("TXN_COUNT_SUBSCRIPTION")
                                .type(DonationType.SUBSCRIPTION)
                                .createdAt(now)
                                .updatedAt(now)
                                .build();
                donationRepository.save(subscriptionInRange);

                // When
                long oneTimeCount = donationRepository.countByTypeAndDateBetween(DonationType.ONE_TIME, yesterday,
                                tomorrow);
                long subscriptionCount = donationRepository.countByTypeAndDateBetween(DonationType.SUBSCRIPTION,
                                yesterday,
                                tomorrow);

                // Then
                assertEquals(1, oneTimeCount);
                assertEquals(1, subscriptionCount);
        }

        @Test
        void shouldFindRecentDonationsByEmail() {
                // Given
                String testEmail = "recent@example.com";
                Pageable pageable = PageRequest.of(0, 10);

                Donation olderDonation = Donation.builder()
                                .amount(BigDecimal.valueOf(50.00))
                                .transactionId("TXN_RECENT_OLDER")
                                .email(testEmail)
                                .type(DonationType.ONE_TIME)
                                .createdAt(LocalDateTime.now().minusHours(1))
                                .updatedAt(LocalDateTime.now().minusHours(1))
                                .build();

                Donation newerDonation = Donation.builder()
                                .amount(BigDecimal.valueOf(75.00))
                                .transactionId("TXN_RECENT_NEWER")
                                .email(testEmail)
                                .type(DonationType.ONE_TIME)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                donationRepository.save(olderDonation);
                donationRepository.save(newerDonation);

                // When
                List<Donation> recent = donationRepository.findRecentByEmail(testEmail, pageable);

                // Then
                assertEquals(2, recent.size());
                // Should be ordered by creation date descending
                assertTrue(recent.get(0).getCreatedAt().isAfter(recent.get(1).getCreatedAt()) ||
                                recent.get(0).getCreatedAt().equals(recent.get(1).getCreatedAt()));
        }

        @Test
        void shouldReturnZeroForEmptyTotalAmount() {
                // Given - no donations
                LocalDateTime past = LocalDateTime.now().minusDays(10);
                LocalDateTime future = LocalDateTime.now().plusDays(10);

                // When
                BigDecimal total = donationRepository.getTotalAmountBetween(past, future);

                // Then
                assertEquals(BigDecimal.ZERO, total);
        }
}
