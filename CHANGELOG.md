# Changelog

All notable changes to CivicVibe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Initial project setup with Next.js 15 + App Router
- MDX content support with remark-gfm
- Tailwind CSS with orange primary brand colors
- Homepage with hero, value props, and CTAs
- Articles listing page with MDX integration
- Resources page with placeholder content
- Projects page (open source showcase placeholder)
- About page with mission and values
- Contact page with communication channels
- Header and Footer components
- Basic MDX utilities for article management
- Husky + lint-staged for code quality
- Port 3050 assigned for local development

### Technical Decisions
- **MDX over CMS**: Chose version-controlled MDX for agentic content management
- **No database**: Static content site doesn't warrant DB complexity
- **No auth**: Public resource with no user accounts needed
- **Orange brand**: Differentiates from typical "government blue" - signals innovation

---

## Session Log

### Session 1 - January 11, 2026
**Focus**: Project initialization

**What happened**:
- Created product from /new-product command
- Analyzed lobbysherpa-marketing as reference pattern
- Set up complete Next.js 15 project structure
- Implemented all core pages and components
- Configured Tailwind with orange/slate color scheme

**Decisions made**:
- Port 3050 (next available in local port assignments)
- Orange primary color (Ian's preference - breaks from gov blue)
- No Clerk/Sentry (not needed for content site)
- Similar structure to lobbysherpa-marketing
