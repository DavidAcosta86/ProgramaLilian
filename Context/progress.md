# Development Progress - Programa Lilian

> This document tracks ALL development steps following TDD methodology with 80% JaCoCo coverage requirement.
> Working in Windows environment - no bash shortcuts.

## Legend

- ✅ Completed
- 🔄 In progress
- ⏳ Pending
- ❓ To review

---

## 📁 Project Structure Setup

✅ **Milestone 1: Base Infrastructure** (Week 1)

### ✅ Directory Structure

- [x] Create monorepo with Backend/, Frontend/, Context/
- [x] Move BACKEND.md and agent.md to Context/
- [x] Create Backend/ with pom.xml dependencies: Spring Boot 3.3.0, JPA, Web, Security, Validation, Mail, AMQP
- [x] Configure JaCoCo plugin (80% minimum)
- [x] Configure application.properties for MySQL development
- [x] Configure application-test.properties for H2 testing
- [x] Docker: Dockerfile multi-stage for Backend
- [x] Docker: Dockerfile for Frontend Next.js
- [x] Docker: docker-compose.yml with backend, frontend, mysql, rabbitmq, phpmyadmin
- [x] .env.example with all environment variables
- [x] README.md with comprehensive setup instructions

### ✅ First Sprint (TDD Entity Layer)

- [x] Create ProgramaLilianApplication.java main class
- [x] Implement User entity with JPA @Entity, timestamps automatic, builder pattern
- [x] Implement Donation entity with validators, timestamps, enum types
- [x] Create UserRepository with 6 custom queries (findByEmail, bySubscriptionId, countActive, etc.)
- [x] Create DonationRepository with 7 custom queries (findByTransactionId, aggregates, pagination)
- [x] Entity tests: 5 UserTest + 5 DonationTest (integration H2)
- [x] Repository tests: 8 UserRepositoryTest + 8 DonationRepositoryTest (custom queries/data integrity)
- [x] JaCoCo 80% coverage with complex scenarios (timers, constraints, aggregations)

**Current Status:** ✅ Data Layer complete (Entities + Repositories)

---

## 💾 Data Layer (Domain + Persistence)

🔄 **Milestone 2: Core Entities & Repositories** (Week 2)

### ✅ Donation Entity

- [x] Implement Donation entity with validators (@NotNull, @DecimalMin, @Email, etc.)
- [x] Add timestamps (createdAt, updatedAt) with @PrePersist/@PreUpdate
- [x] Add unique constraint on transactionId
- [x] Create DonationTest.java with 10 integration tests (validation, persistence)
- [x] Donation entity TDD complete with 80%+ JaCoCo coverage maintained

### ⏳ Strapi-Compatible Content Models

- [ ] Create Event entity (title, date, description, imagePath, published)
- [ ] Create Talk entity (same as Event)
- [ ] Create Content entity (section: string, content: text, for hero/about sections)
- [ ] Create Media entity (imageUrl, altText, type, imageHint)
- [ ] Create SocialPost entity (url, caption, platform, published) - fetched via Spring, curated via Strapi

### 🔄 Repository Layer

- [ ] Create UserRepository extending JpaRepository<User, Long>
- [ ] Create DonationRepository extending JpaRepository<Donation, Long>
- [ ] Add custom query methods (findByEmail, findByTransactionId, etc.)
- [ ] Create repository tests with @DataJpaTest
- [ ] Maintain 80% JaCoCo coverage across repositories

---

## 🔧 Service Layer (Business Logic)

⏳ **Milestone 3: Application Services** (Week 3-4)

### ⏳ User Membership Service

- [ ] Create UserService interface (createMember, findById, findByEmail, updatePayment)
- [ ] Create UserServiceImpl with validation and logging
- [ ] Add business rules: email uniqueness, data validation
- [ ] Create gateway to MercadoPago for subscription initiation
- [ ] Unit tests for UserService with mocks

### ⏳ Donation Service

- [ ] Create DonationService interface (processOneTimeDonation, validatePayment, sendReceipt)
- [ ] Create DonationServiceImpl with MercadoPago preference creation
- [ ] Implement signature verification for webhooks
- [ ] Integration tests with mocked HTTP calls to MercadoPago
- [ ] Maintain >80% coverage with service tests

### ⏳ Social Media Service

- [ ] Create SocialMediaService interface (syncFacebookPosts, syncInstagramPosts)
- [ ] Integration with Facebook Graph API v12+
- [ ] Integration with Instagram Basic Display API
- [ ] Store fetched posts in Spring DB for curation
- [ ] Tests with mocked HTTP responses
- [ ] Error handling for rate limits and API failures

### ⏳ Email Messaging Service

- [ ] Create EmailService interface (sendWelcomeEmail, sendReceipt)
- [ ] RabbitMQ asynchronous messaging configuration
- [ ] Consumer for processing email queue
- [ ] Email templates (welcome, donation receipt, subscription confirm)
- [ ] Tests with embedded RabbitMQ (Testcontainers if needed)

---

## 🌐 API Controllers & Validation

⏭️ **Milestone 4: REST API Endpoints** (Week 5-6)

### ⏳ Public Endpoints (No Auth)

- [ ] POST /api/donations/initiate - Create MercadoPago preference, return URL
- [ ] POST /api/members - Register using UserService, return memberId
- [ ] POST /api/members/subscribe - Create subscription, redirect to MercadoPago
- [ ] GET /api/social-posts - Return published social posts (paginated)
- [ ] GET /api/events - Return published events (later from Strapi)
- [ ] GET /api/talks - Return published talks

### ⏳ Webhook Endpoints

- [ ] POST /webhooks/mercadopago - Handle payment confirmations, update donations, trigger emails
- [ ] Secure webhook with signature validation
- [ ] Queue email notifications via RabbitMQ

### ⏳ Admin Endpoints (JWT Protected)

- [ ] GET /api/admin/members - Retrieve members with pagination/filters
- [ ] GET /api/admin/donations - Donation statistics and history
- [ ] POST /api/admin/social-posts/sync - Trigger social media sync
- [ ] GET /api/admin/social-posts - View all fetched posts
- [ ] PUT /api/admin/social-posts/{id}/publish - Mark post for display

### ⏳ Content Management Endpoints

- [ ] CRUD endpoints for Event, Talk, Content entities
- [ ] Media upload endpoint with cloud storage integration
- [ ] Import from Strapi if transitioning later

---

## 🔐 Authentication & Authorization

⏭️ **Milestone 5: Security Layer** (Week 7-8)

### ⏳ JWT Authentication

- [ ] Create JwtService for token generation/validation
- [ ] Configure Spring Security with JWT filter
- [ ] Admin user creation and management
- [ ] Tests for token validation and expiration

### ⏳ Google OAuth2 Integration

- [ ] Configure OAuth2 client with Google
- [ ] Callback handling for OAuth flow
- [ ] JWT token issuance for authenticated users
- [ ] Social login UI integration in frontend

### ⏳ Authorization & Roles

- [ ] Role-based authorization (ADMIN, MEMBER)
- [ ] Endpoint-specific permissions
- [ ] Security tests with @WithMockUser

---

## 🔄 Async Processing & Integration

⏭️ **Milestone 6: Background Jobs** (Week 9-10)

### ⏳ RabbitMQ Integration

- [ ] Configure RabbitMQ connection and queues
- [ ] Email queue consumer implementation
- [ ] Error handling and dead letter queue
- [ ] Monitoring and queue management UI

### ⏳ Scheduled Tasks

- [ ] Social media sync scheduler (every 6 hours)
- [ ] Cleanup jobs for expired data
- [ ] Subscription renewal notifications
- [ ] Tests for scheduled execution

### ⏳ Email Delivery

- [ ] Gmail SMTP configuration with OAuth2
- [ ] Email template engine (Thymeleaf)
- [ ] Receipt and notification templates
- [ ] SMTP mocking for tests

---

## 🌐 Frontend Integration & Testing

⏭️ **Milestone 7: Full Stack Integration** (Week 11-12)

### ⏳ API Consumption

- [ ] Update Frontend to call Spring Boot APIs
- [ ] Remove hardcoded data, replace with API calls
- [ ] Error handling and loading states
- [ ] Update Socios form to POST to /api/members

### ⏳ Donation Flow Integration

- [ ] Update /donate page to use MercadoPago flow
- [ ] Handle redirects and confirmations
- [ ] Display receipt on success

### ⏳ End-to-End Testing

- [ ] Selenium or Playwright for user flows
- [ ] API contract testing
- [ ] Integration tests with real database (Testcontainers)

---

## 🚀 Deployment & Production

⏭️ **Milestone 8: Production Ready** (Week 13-14)

### ⏳ Cloud Configuration

- [ ] Select hosting provider (Railway/Railway with postgres)
- [ ] Database provisioning and migrations
- [ ] Environment variable setup for production
- [ ] SSL certificate configuration

### ⏳ CI/CD Pipeline

- [ ] GitHub Actions for build/test/deploy
- [ ] Dockerfile optimization for production
- [ ] Automated database backups
- [ ] Rollback procedures

### ⏳ Monitoring & Logs

- [ ] Application metrics with Micrometer
- [ ] Log aggregation (Loki if needed)
- [ ] Health checks configuration
- [ ] Alerting for payment failures

---

## 📋 Testing & Quality Assurance

📈 **Cross-Cutting: Code Quality** (All Milestones)

### 📊 JaCoCo Coverage Requirements

- [ ] Maintain ≥80% line coverage across all modules
- [ ] Report generation on every build
- [ ] Exclude getters/setters from coverage calculation
- [ ] Branch coverage where meaningful

### 🧪 Testing Pyramid Enforcement

- [ ] Unit tests: 60-70% (Services, Utils, Validation)
- [ ] Component tests: 20-30% (Controllers with mocks)
- [ ] Integration tests: 10-15% (Database, HTTP)
- [ ] End-to-end: <5% (critical user flows)

### 🔒 Security Testing

- [ ] OWASP guideline compliance
- [ ] SQL injection prevention tests
- [ ] Authentication bypass tests
- [ ] Input validation negative tests
- [ ] External service mocking for security scenarios

### 📝 Code Quality Gates

- [ ] Spotless or similar for code formatting
- [ ] PMD/SpotBugs for static analysis
- [ ] Dependabot for dependency updates
- [ ] PR reviews with approval gates

---

## 🔄 Future Enhancements

📅 **Post-MVP Features**

### ⏳ Advanced Features

- [ ] Email campaigns for members
- [ ] Donation analytics dashboard
- [ ] Volunteer form integration
- [ ] Multi-language support
- [ ] Payment methods expansion (other gateways)
- [ ] API rate limiting per user
- [ ] Audit logging for sensitive operations

### ⏳ Performance & Scalability

- [ ] Redis caching for frequently accessed data
- [ ] Database query optimization and indexing
- [ ] Horizontal scaling preparation
- [ ] CDN integration for static assets
- [ ] Background job processing scaling

---

## 📊 Current Coverage Status

**Backend:**

- Lines: 0% → maintaining ≥80% after initial implementation
- Branches: 0% → maintaining quality assertions

**Frontend:**

- Cypress/component tests: Pending API integration

---

## ⚠️ Known Risks & Mitigations

**1. MercadoPago API Changes:** Monitor changelog, implement webhook signature validation always

**2. Email Delivery Limits:** Start with Gmail SMTP limits, migrate to SendGrid when volume increases

**3. Social Media API Deprecation:** Choose stable endpoints, implement fallback mechanisms

**4. Database Scaling:** Design with future sharding in mind, avoid premature optimization

**5. Fraud Prevention:** IP rate limiting, suspicious pattern detection on donations

---

**Last Updated:** [Date]
**Current Sprint:** TDD Entity Layer
**Next Deliverable:** Repository Layer Implementation
