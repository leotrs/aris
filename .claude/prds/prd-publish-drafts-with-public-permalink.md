# Product Requirements Document: Publish Drafts with Public Permalink

## 1. Executive Summary
**Feature Name:** Publish Drafts with Public Permalink
**Priority:** High
**Effort Estimate:** 2-3 weeks
**Developer:** Individual

This feature enables authors to publish their research manuscripts as public preprints with persistent permalinks, establishing Aris as a preprint server for scientific dissemination. Authors can make their near-final research publicly accessible for community engagement, feedback through future public annotations, and academic discourse while maintaining permanent, citable URLs for their work.

## 2. Problem & Solution
### Current State
- Aris manuscripts remain private and inaccessible to the broader scientific community
- No mechanism exists for public dissemination of research as preprints
- Authors must use external preprint servers (arXiv, bioRxiv) where feedback is extremely difficult to obtain
- The platform lacks the foundational infrastructure for becoming a preprint repository
- Research cannot be publicly cited or referenced until published through traditional journals
- Standard preprint servers provide minimal feedback mechanisms beyond social media sharing

### Desired State
- Authors can publish preprints with permanent, citable public URLs
- Aris becomes a viable preprint server with superior feedback capabilities through future public annotations
- Research gains immediate public visibility and structured feedback opportunities
- Persistent permalinks enable proper academic citation and reference
- The platform establishes itself as a destination for interactive open science publication
- Authors receive meaningful feedback on their research through integrated platform features

### Assumptions
- Authors want to disseminate near-final research to maximize impact, citations, and feedback
- The scientific community values open access to preprint research with feedback capabilities
- Permanent URLs are essential for academic citation and archival purposes
- Public preprints should maintain professional presentation standards
- Future public annotation capabilities will provide superior feedback compared to traditional preprint servers
- Structured feedback through annotations is more valuable than social media discussions

## 3. User Analysis
### Assumed Personas
- **Primary User Type:** Research Author/Scientist (Publishing)
  - Goals: Disseminate research findings publicly, establish priority/precedence, maximize impact through early visibility, receive structured feedback on their work
  - Pain Points: Cannot share finished research publicly through Aris, forced to use external preprint servers where feedback is minimal and difficult to obtain, limited to social media for research discussion
  - Context: Has completed research ready for public dissemination, seeking academic visibility, citations, and meaningful peer feedback

- **Secondary User Type:** Research Community Member (Consuming)
  - Goals: Discover and access cutting-edge research, cite preprints in their own work, stay current with field developments, provide feedback to authors
  - Pain Points: Needs immediate access to research without barriers, requires stable URLs for citation, wants to engage with authors but lacks good feedback mechanisms on traditional platforms
  - Context: Browsing research literature, preparing citations, following research developments, engaging with research community

### User Scenarios
- **Scenario 1:** Research author completes manuscript and wants to establish public priority while seeking community feedback before journal submission - publishes preprint with permanent URL that can be cited immediately and opens door for structured feedback through future annotation features
- **Scenario 2:** Scientist discovers interesting preprint and wants to provide specific feedback on methodology - accesses persistent URL, reads research, and will later use public annotation system to provide targeted feedback directly to authors

## 4. Scope Definition
### Features Included
- **Preprint Publication:** Convert private manuscripts to public preprints with single action
- **Permanent Public URLs:** Generate stable, citable permalinks for published preprints
- **Public Preprint Viewer:** Professional presentation interface for public research access
- **Publication Status Indicator:** Clear visual distinction between private drafts and published preprints
- **Withdrawal System:** arXiv-style withdrawal that maintains accessibility while marking status

### Features Explicitly Excluded
- **DOI Assignment:** Zenodo integration for automatic DOI generation (future enhancement)
- **Collaboration Features:** Private collaboration and review workflows (separate future implementation)
- **Public Annotation System:** Community commenting capabilities (future enhancement with author control)
- **Version Management:** Multiple version support with unique URLs (future consideration)
- **Search and Discovery:** Public preprint search functionality (future implementation, but DB designed to support)
- **Premium Permalinks:** Human-readable custom URLs (future paid feature)

### User Stories
- **As a research author, I want to publish my manuscript as a public preprint** so that my research gains immediate visibility, can be cited by the community, and opens pathways for feedback
- **As a research author, I want a permanent URL for my published preprint** so that citations and references remain stable over time
- **As a community member, I want to access published preprints immediately via permalink** so that I can read, cite, and eventually provide feedback on cutting-edge research
- **As a research author, I want to be able to withdraw my preprint if fundamental errors are discovered** so that I can responsibly manage flawed research while maintaining the scientific record

## 5. Technical Requirements
### Frontend Requirements
- "Publish Preprint" button in manuscript interface (replacing generic sharing)
- Public preprint viewer component optimized for research presentation
- Publication status indicator in private file management
- Preprint publication confirmation modal with permalink display
- Professional public layout with proper research metadata display
- Withdrawal interface following arXiv model (future consideration)

### Backend Requirements
- New `is_published` boolean field on File model (distinct from sharing/collaboration)
- `published_at` timestamp field for tracking publication details
- `permalink_slug` field for future premium URL support (initially auto-generated)
- `public_uuid` field for stable public identification (replaces file_id in URLs)
- Public preprint access endpoint (`/ication/{uuid}` and future `/ication/{permalink_slug}`)
- Preprint metadata endpoint for citation information (title, authors, publication date)
- Publication status toggle API with permanent commitment (withdrawal but not deletion)
- Enhanced public content rendering with research-focused presentation

### System Component Impact Analysis
#### Database (Critical)
- Add `is_published` boolean, `published_at` timestamp to `files` table
- Add `permalink_slug` varchar field with unique constraint for future premium URLs
- Add `public_uuid` UUID field with unique constraint for stable public identification
- Add search-optimized fields: `public_title`, `public_abstract`, `keywords` for future discovery
- Create database indexes on `is_published`, `published_at`, `public_uuid`, `permalink_slug`, and search fields for efficient queries
- Migration strategy ensuring published status is permanent and withdrawal maintains accessibility
- Design schema to support future versioning with `version_number` and `parent_version_id` fields

#### Marketing Website (Critical)
- Major feature announcement positioning Aris as preprint server with superior feedback capabilities
- Public preprint discovery page showcasing published research (future implementation)
- SEO optimization for preprint content and academic search engines
- Integration with academic search indexing systems

#### Dev Container (Low)
- Environment configuration for public preprint URLs
- Academic metadata standards compliance (Dublin Core, Schema.org)

#### CI Configuration (Medium)
- E2E tests for preprint publication workflow
- Public preprint accessibility testing across browsers
- SEO and metadata validation testing
- Performance testing for public preprint traffic

#### Infrastructure (High)
- CDN optimization for public preprint content delivery
- Search engine indexing configuration for academic discovery
- Rate limiting and caching strategies for public preprint access
- Analytics tracking for preprint engagement and future feedback patterns

### Integration Points
- Enhanced RSM-to-HTML rendering for academic presentation standards
- Future integration points for public annotation system (author-controlled feedback)
- Academic citation format generation and metadata export
- Integration with academic search engines and indexing services
- Database design supporting future versioning and search functionality
- Permalink architecture supporting future premium URL customization

## 6. Acceptance Criteria
### Functional Requirements
- [ ] Authors can publish manuscripts as permanent public preprints
- [ ] Published preprints receive stable, citable permalink URLs
- [ ] Public preprints display with proper academic formatting and metadata
- [ ] Publication status persists permanently with arXiv-style withdrawal capability
- [ ] Public preprint access works reliably without authentication requirements
- [ ] UUID generation creates unique, stable public identifiers

### User Experience Requirements
- [ ] "Publish Preprint" action is prominently available and clearly labeled
- [ ] Public preprint viewer provides professional, academic-quality presentation
- [ ] Publication confirmation clearly communicates permanence and displays permalink
- [ ] Public preprints load quickly and display consistently across devices
- [ ] Preprint metadata supports proper academic citation formats
- [ ] Publication process communicates future feedback capabilities through annotations

### Technical Requirements
- [ ] Public preprint URLs remain stable and accessible indefinitely
- [ ] Preprint publication process completes reliably with automatic UUID generation
- [ ] Public preprint content renders with academic presentation standards
- [ ] Published preprints are discoverable by search engines with proper metadata
- [ ] Performance remains optimal under public preprint traffic loads
- [ ] Database schema supports future search, versioning, and premium URL requirements

### Test Scenarios
- [ ] **Happy Path:** Author publishes preprint, permalink generates successfully, public access works immediately
- [ ] **Academic Use Case:** External researcher accesses preprint URL, content displays professionally with citation information
- [ ] **Permanence Test:** Published preprint remains accessible after author account changes
- [ ] **UUID Generation:** Unique UUIDs generate consistently for stable public access

### Manual Validation Steps
- [ ] Published preprints meet academic presentation quality standards comparable to arXiv/bioRxiv
- [ ] UUID generation creates stable, predictable URLs
- [ ] Publication workflow appropriately communicates permanent commitment and future feedback opportunities

## 7. Implementation Plan
### Phase 1 (MVP)
- Add permanent publication fields to File model (`is_published`, `published_at`, `public_uuid`, `permalink_slug`)
- Create public preprint access endpoints with academic presentation (`/ication/{uuid}`)
- Develop "Publish Preprint" interface in manuscript management
- Build public preprint viewer with professional research layout
- Implement UUID generation and unique constraint handling

### Phase 2 (Preprint Server Enhancement)
- arXiv-style withdrawal system maintaining accessibility
- Academic metadata generation and export capabilities
- Search engine optimization and indexing integration
- Database preparation for future versioning and search functionality

### Phase 3 (Future Enhancements)
- Zenodo API integration for automatic DOI assignment
- Premium permalink system as paid feature
- Enhanced citation format generation

### Dependencies
- Enhanced RSM rendering for academic presentation quality
- Public URL structure design for permanent accessibility and future premium URLs
- Academic metadata standards research and implementation
- Search engine indexing and SEO configuration

### Technical Risks
- **Permalink permanence:** Mitigation through immutable URL design and proper database constraints
- **Academic presentation quality:** Mitigation through research community feedback and iterative improvement
- **Future versioning compatibility:** Mitigation through forward-thinking database design
- **Search integration complexity:** Mitigation through proper schema design and indexing strategy
- **Premium URL conflicts:** Mitigation through robust slug generation and conflict resolution

### Testing Strategy
- Unit tests for permanent publication status and UUID generation
- Integration tests for public preprint access and metadata
- E2E tests covering complete preprint publication workflow
- Performance testing for public preprint discovery and access patterns
- Academic presentation quality validation with research community feedback
- Database schema testing for future search, versioning, and premium URL requirements

## 8. Open Questions
### Design Decisions
- [ ] Should we implement any URL shortening or additional SEO optimization for `/ication/{uuid}` URLs?
- [ ] How should we handle academic metadata display (authors, affiliations, publication date)?
- [ ] Should we implement withdrawal interface in Phase 1 or Phase 2?

### Technical Decisions
- [ ] Should UUIDs be standard v4 or use a more compact format for shorter URLs?
- [ ] How should we structure database fields to optimally support future search functionality?
- [ ] What permalink slug generation strategy best supports future premium URL migration?

### User Experience Decisions
- [ ] Should there be a preview mode showing how the preprint will appear publicly before publication?
- [ ] How should we communicate the permanent nature and future feedback capabilities during publication?
- [ ] Should we display permalink immediately during publication confirmation or after processing?

---

**Next Steps:**
1. Review and refine this PRD with stakeholders
2. Break down implementation into specific tasks
3. Estimate effort and timeline
4. Begin development phase