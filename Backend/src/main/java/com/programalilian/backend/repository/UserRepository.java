package com.programalilian.backend.repository;

import com.programalilian.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for User entity operations.
 * Extends JpaRepository for basic CRUD operations and adds custom queries.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address.
     * 
     * @param email Email to search for
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by email.
     * 
     * @param email Email to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find users by subscription plan type.
     * 
     * @param subscriptionPlan Plan type (Mensual, Trimestral, etc.)
     * @return Iterable of users with matching plan
     */
    Iterable<User> findBySubscriptionPlan(String subscriptionPlan);

    /**
     * Count users with active subscriptions (non-null subscriptionId).
     * 
     * @return Number of users with active subscriptions
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.subscriptionId IS NOT NULL")
    long countUsersWithActiveSubscriptions();

    /**
     * Find user by MercadoPago subscription ID.
     * 
     * @param subscriptionId MercadoPago subscription identifier
     * @return Optional containing user if found
     */
    Optional<User> findBySubscriptionId(@Param("subscriptionId") String subscriptionId);
}
