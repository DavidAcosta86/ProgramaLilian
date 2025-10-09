package com.programalilian.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String section; // "hero", "about", "events", etc.

    private String subtype; // sub-clasificación, como event type

    @Column(length = 1000)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String subtitle;

    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] imageData; // Binary image data

    private String imageType; // MIME type (png, jpg, etc.)

    private String buttonText1;
    private String buttonUrl1;
    private String buttonText2;
    private String buttonUrl2;

    private String date; // For events/talks
    private String link; // external links

    private Boolean published;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
