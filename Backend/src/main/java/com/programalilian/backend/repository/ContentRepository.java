package com.programalilian.backend.repository;

import com.programalilian.backend.domain.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {

    /**
     * Find all published content
     */
    List<Content> findByPublishedTrue();

    /**
     * Find content by section
     */
    List<Content> findBySection(String section);

    /**
     * Find published content by section
     */
    List<Content> findBySectionAndPublishedTrue(String section);

    /**
     * Find published single content (for hero, about)
     */
    @Query("SELECT c FROM Content c WHERE c.section = :section AND c.published = true ORDER BY c.createdAt DESC")
    Content findTopBySectionAndPublishedOrderByCreatedAtDesc(@Param("section") String section);

    /**
     * Find content by multiple sections and published status
     */
    List<Content> findBySectionInAndPublishedTrue(List<String> sections);
}
