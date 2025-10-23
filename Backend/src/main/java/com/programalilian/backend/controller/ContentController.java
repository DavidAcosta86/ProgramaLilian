package com.programalilian.backend.controller;

import com.programalilian.backend.domain.Content;
import com.programalilian.backend.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Content Management Controller
 * Provides admin panel content CRUD and public APIs
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    // ========================================
    // Public APIs (for frontend)
    // ========================================

    @GetMapping("/content/published")
    public ResponseEntity<List<Content>> getPublishedContent() {
        return ResponseEntity.ok(contentService.getPublishedContent());
    }

    @GetMapping("/content/section/{section}")
    public ResponseEntity<List<Content>> getContentBySection(@PathVariable String section) {
        return ResponseEntity.ok(contentService.getContentBySection(section));
    }

    @GetMapping("/content/single/{section}")
    public ResponseEntity<Content> getSingleContentBySection(@PathVariable String section) {
        Content content = contentService.getSingleContentBySection(section);
        if (content != null) {
            return ResponseEntity.ok(content);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/content/upcoming")
    public ResponseEntity<List<Content>> getUpcomingContent() {
        return ResponseEntity.ok(contentService.getUpcomingContent());
    }

    @GetMapping("/content/image/{contentId}")
    public ResponseEntity<ByteArrayResource> getContentImage(@PathVariable Long contentId) {
        try {
            Content content = contentService.getContentById(contentId);
            if (content != null && content.getImageData() != null) {
                MediaType mediaType = MediaType.IMAGE_JPEG;
                if ("image/png".equalsIgnoreCase(content.getImageType())) {
                    mediaType = MediaType.IMAGE_PNG;
                }
                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(new ByteArrayResource(content.getImageData()));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error in getContentImage for contentId " + contentId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ========================================
    // Admin APIs
    // ========================================

    @GetMapping("/admin/content")
    public ResponseEntity<List<Content>> getAllContent() {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    @GetMapping("/admin/content/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable Long id) {
        Content content = contentService.getContentById(id);
        if (content != null) {
            return ResponseEntity.ok(content);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/content")
    public ResponseEntity<Content> createContent(@RequestBody Content content) {
        // Ensure we create new content by setting ID to null
        content.setId(null);
        Content created = contentService.createContent(content);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/admin/content/with-image")
    public ResponseEntity<?> createContentWithImage(
            @RequestParam String section,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String subtitle,
            @RequestParam(required = false) String buttonText1,
            @RequestParam(required = false) String buttonUrl1,
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) MultipartFile imageFile) {

        Content contentObj = Content.builder()
                .section(section)
                .title(title)
                .content(content)
                .subtitle(subtitle)
                .buttonText1(buttonText1)
                .buttonUrl1(buttonUrl1)
                .published(published != null ? published : true)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                byte[] compressedImage = contentService.processImageUpload(imageFile);
                contentObj.setImageData(compressedImage);
                contentObj.setImageType(imageFile.getContentType());
            } catch (IllegalArgumentException e) {
                // Handle image size validation error
                return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("{\"error\": \"Error al procesar la imagen\"}");
            }
        }

        // Ensure we create new content by setting ID to null
        contentObj.setId(null);
        Content created = contentService.createContent(contentObj);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/admin/content/{id}")
    public ResponseEntity<Content> updateContent(@PathVariable Long id, @RequestBody Content content) {
        Content updated = contentService.updateContent(id, content);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/admin/content/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/content/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            byte[] compressedData = contentService.processImageUpload(file);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(compressedData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Error al procesar la imagen\"}");
        }
    }
}
