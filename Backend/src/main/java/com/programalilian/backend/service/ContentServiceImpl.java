package com.programalilian.backend.service;

import com.programalilian.backend.domain.Content;
import com.programalilian.backend.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ContentService
 */
@Service
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Content> getPublishedContent() {
        return contentRepository.findByPublishedTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Content> getContentBySection(String section) {
        return contentRepository.findBySectionAndPublishedTrue(section);
    }

    @Override
    @Transactional(readOnly = true)
    public Content getContentById(Long id) {
        return contentRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public Content getSingleContentBySection(String section) {
        return contentRepository.findTopBySectionAndPublishedOrderByCreatedAtDesc(section);
    }

    @Override
    @Transactional
    public Content createContent(Content content) {
        content.setPublished(content.getPublished() != null ? content.getPublished() : true);
        return contentRepository.save(content);
    }

    @Override
    @Transactional
    public Content updateContent(Long id, Content content) {
        Content existing = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));

        // Update all fields
        existing.setSection(content.getSection());
        existing.setTitle(content.getTitle());
        existing.setContent(content.getContent());
        existing.setSubtitle(content.getSubtitle());
        existing.setButtonText1(content.getButtonText1());
        existing.setButtonUrl1(content.getButtonUrl1());
        existing.setButtonText2(content.getButtonText2());
        existing.setButtonUrl2(content.getButtonUrl2());
        existing.setDate(content.getDate());
        existing.setLink(content.getLink());
        if (content.getImageData() != null) {
            existing.setImageData(content.getImageData());
            existing.setImageType(content.getImageType());
        }
        existing.setPublished(content.getPublished());

        return contentRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteContent(Long id) {
        contentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Content> getUpcomingContent() {
        // Get all published content from events, talks, and social-posts
        List<String> sections = List.of("events", "talks", "social-posts");
        List<Content> allContent = contentRepository.findBySectionInAndPublishedTrue(sections);

        // Sort by creation date (newest first) and limit to 8
        return allContent.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(8)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] processImageUpload(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return null;
        }

        // Check file size limit: 5MB = 5 * 1024 * 1024 bytes
        long maxSize = 5L * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("La imagen es demasiado grande. El tamaño máximo permitido es 5MB.");
        }

        // For compression: reduce to 800px max, JPEG quality 85%
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(file.getBytes()))
                .size(800, 600)
                .outputQuality(0.85)
                .toOutputStream(outputStream);

        return outputStream.toByteArray();
    }
}
