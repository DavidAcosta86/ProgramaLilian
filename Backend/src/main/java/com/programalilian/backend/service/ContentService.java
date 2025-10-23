package com.programalilian.backend.service;

import com.programalilian.backend.domain.Content;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service for content management operations
 */
public interface ContentService {

    /**
     * Get all published content
     */
    List<Content> getPublishedContent();

    /**
     * Get all content (published and unpublished) for admin
     */
    List<Content> getAllContent();

    /**
     * Get content by section
     */
    List<Content> getContentBySection(String section);

    /**
     * Get single content by section (for hero, about)
     */
    Content getSingleContentBySection(String section);

    /**
     * Get content by ID
     */
    Content getContentById(Long id);

    /**
     * Create new content
     */
    Content createContent(Content content);

    /**
     * Update existing content
     */
    Content updateContent(Long id, Content content);

    /**
     * Delete content
     */
    void deleteContent(Long id);

    /**
     * Process and compress image upload
     */
    byte[] processImageUpload(MultipartFile file) throws Exception;

    /**
     * Get upcoming content (events + talks + social-posts) for homepage
     */
    List<Content> getUpcomingContent();
}
