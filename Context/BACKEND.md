# Backend Requirements for Programa Lilian Web Hub

Based on the analysis of the frontend application, below are the backend requirements to support the dynamic functionality, data management, and integrations needed.

## Overview

The system will use a separate Headless CMS (Strapi) to handle content management, allowing the Java Spring Boot backend to focus on payment processing, membership registration, and social media integrations. This separation reduces backend workload and enables the team to update content autonomously.

### User Flows

- **Donations**: One-time donations are anonymous. Users select amount on /donate and can optionally provide name/email for receipts. No account creation required. Backend creates Mercado Pago preference and redirects; webhooks confirm payments and send receipts.
- **Socios (Memberships)**: Users register on /socios with contact info (name, email, phone, optional birth date), then select subscription plan (monthly, quarterly, etc.). Backend creates Mercado Pago subscription; Mercado Pago handles recurring billing automatically without manual emails. Webhooks confirm each payment, update database, and send automated receipts.

## Core Technologies

- **Backend / Lógica de Pagos**: Java y Spring Boot - Gratuito y Open Source. Permite construir una API RESTful segura para procesar transacciones y gestionar el registro de socios.
- **Framework**: Spring Boot con Spring Data JPA para desarrollo de API
- **Database**: PostgreSQL (o MySQL Community Edition) - Gratuito y Open Source. Fundamental para almacenar de forma segura la lista de socios y el historial de donaciones.
- **Gestión de Contenido (CMS)**: Strapi o Headless CMS - Gratuito y Open Source. Permite al equipo del Programa Lilian actualizar textos, noticias y eventos (charlas de prevención, ferias solidarias) sin tocar el código.
- **Authentication**: Spring Security con JWT
- **Payments**: Mercado Pago API integration
- **Storage**: Cloud storage (AWS S3, Cloudinary, or Firebase Storage) for images
- **Email**: SMTP service (SendGrid, Mailgun) for receipts and communications
- **Social Media**: Facebook Graph API and Instagram Basic Display API for social media integration

## Database Models

### PostgreSQL (Spring Boot Database)

#### User (Socios/Members)

- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- fullName: VARCHAR(255) NOT NULL
- email: VARCHAR(255) NOT NULL UNIQUE
- phone: VARCHAR(20) NULL
- birthDate: DATE NULL (optional)
- subscriptionPlan: ENUM('Mensual', 'Trimestral', 'Semestral', 'Anual') NULL
- subscriptionId: VARCHAR(255) NULL (from Mercado Pago)
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updatedAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### Donation

- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- donorName: VARCHAR(255) NULL
- email: VARCHAR(255) NULL (for receipts)
- amount: DECIMAL(10,2) NOT NULL
- transactionId: VARCHAR(255) NOT NULL (from Mercado Pago)
- type: ENUM('one-time', 'subscription') NOT NULL
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Strapi Database (PostgreSQL or per Strapi config)

Strapi manages its own models for content, which include Events, Talks, Media, Content sections, and SocialPosts. These can be configured via Strapi admin panel. Spring Boot can integrate via API calls or direct access if using the same DB instance.

#### Typical Strapi Models (Managed via CMS):

- Events: Titles, descriptions, dates, images, publish status
- Talks: Similar to events
- Content: Editable text sections for hero, about, etc.
- Media: File uploads with metadata
- SocialPosts: Fetched and curated posts with images and captions

## API Endpoints

### Public Endpoints

#### Content Fetching

- `GET /api/content/hero` - Get hero section content (title, subtitle, background image)
- `GET /api/content/about` - Get about us section content (mission, description, icons)
- `GET /api/content/involve` - Get get involved section content (title, description)
- `GET /api/events?page=1&limit=10` - Get published events with pagination
- `GET /api/talks?page=1&limit=10` - Get published talks with pagination
- `GET /api/social-posts?limit=3` - Get recent social media posts
- `GET /api/images/:id` - Serve media files (or redirect to CDN)

#### Donation Processing

- `POST /api/donations/initiate` - Initiate donation with Mercado Pago
  - Body: { amount, donorName?, email?, type: 'one-time' }
  - Returns: Mercado Pago payment URL
- `POST /webhooks/mercadopago` - Mercado Pago webhook for payment confirmation
  - Update donation status, send receipt email

#### Membership Registration

- `POST /api/members` - Register new member
  - Body: { fullName, email, phone?, planType }
  - Returns: member data
- `POST /api/members/subscribe` - Initiate subscription with Mercado Pago
  - Body: { memberId, planType }
  - Returns: Mercado Pago subscription URL

### Admin Endpoints (Protected with Authentication)

#### Content Management

- `GET /api/admin/content` - Get all editable content
- `PUT /api/admin/content/:id` - Update content section

#### Events & Talks Management

- `GET /api/admin/events` - Get all events (published/unpublished)
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `PUT /api/admin/events/:id/publish` - Publish/unpublish event
- Same endpoints for `talks`

#### Social Media Management

- `POST /api/admin/social-posts/sync` - Trigger sync with social media APIs
- `GET /api/admin/social-posts` - Get all social posts
- `PUT /api/admin/social-posts/:id/publish` - Publish to website
- `DELETE /api/admin/social-posts/:id` - Remove post

#### Media Management

- `POST /api/admin/media/upload` - Upload image to cloud storage
  - Multipart form with file and metadata
  - Returns: media object
- `GET /api/admin/media` - List all media
- `DELETE /api/admin/media/:id` - Delete media

#### Members & Donations

- `GET /api/admin/members` - Get all members with pagination
- `GET /api/admin/donations` - Get donations with filtering
- `GET /api/admin/donations/stats` - Get donation statistics

#### Admin Authentication

- `POST /api/admin/auth/login` - Login and return JWT
- `GET /api/admin/auth/me` - Get current admin user

## Architecture Separation

### Strapi (Headless CMS) Responsibilities

- Content management: Editable sections (hero, about, involve)
- Events and talks CRUD with publish/unpublish
- Media library: Image uploads and management
- Admin panel for content creators (no coding required)
- Social posts display from admin-selected posts

Frontend will call Strapi API directly for content, while Spring Boot handles dynamic data and integrations.

### Spring Boot Responsibilities

- Membership and donation processing
- Mercado Pago integrations
- Social media API syncing to fetch posts (stored in Strapi or Spring DB)
- Email notifications
- Admin authentication for backend-specific operations

## Integrations

### Mercado Pago

- Implement preference creation for one-time donations
- Implement subscription creation for recurring payments
- Handle webhooks for payment confirmations
- Map subscription plans to amounts:
  - Mensual: $1,500
  - Trimestral: $4,500
  - Semestral: $9,000
  - Anual: $18,000

### Strapi Headless CMS

- Use Strapi for content management to reduce custom backend development
- Strapi provides:
  - Admin UI for non-technical users
  - REST API for content fetching
  - Image uploads and media library
  - Version control and backups
- Integration: Frontend fetches content directly from Strapi; Spring Boot can sync social media posts into Strapi collections

### Social Media

- Facebook Graph API v12+ for page posts
- Instagram Basic Display API for feed posts
- Scheduled sync (daily) via Spring Boot to fetch recent posts
- Store fetched posts in Strapi collection for admin curation

### Email Notifications

- Receipt emails for donations
- Welcome emails for new members
- Transaction confirmations

## Security Considerations

- Input validation and sanitization
- Rate limiting for public endpoints
- CORS configuration for frontend domain
- JWT tokens with expiration
- Secure payment data handling
- GDPR compliance for user data (consent, deletion)

## Hosting & Deployment

- Heroku/AWS/GCP for backend
- PostgreSQL hosting (same provider)
- CDN for image delivery
- SSL certificates
- Environment variable management

## Additional Features

- Analytics dashboard for admin
- Email campaigns for members
- Volunteer form submissions (expand beyond WA link)
- SEO optimization (pre-rendered content)
