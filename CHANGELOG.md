# Changelog

All notable changes to CivicVibe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### October 22, 2026: two-door rebuild

Added
- `scripts/sync-content.mjs` and `npm run sync`: copies `digital-services/system/` docs and templates into `content/system/` and `content/templates/`, rewrites links, adds frontmatter, strips Sources sections, and fails on boundary terms. Runs before `next build`.
- Routes: `/` (wireframe 1–7, two doors), `/start` (door 1), `/system` (door 2: chains, templates, doc list), `/system/[slug]` (16 docs), `/templates/[slug]` (15 templates, tabbed, Copy and Download), `/story` (stub).
- Visible `[copy needed: …]` markers where copy doesn't exist yet.
- Markdown rendering via unified with GFM tables, raw HTML, heading slugs; tables scroll in their own box.

Changed
- Header: two door labels, "The system", "GitHub". Footer: disclaimer, licensing, email, GitHub.
- Links and buttons use orange 700 for contrast.
- Removed personal-venture `authors` metadata (BOUNDARIES #4).

Removed
- `/resources`, `/resources/[slug]`, `/about`, `/contact`, the three-lens homepage, `next-mdx-remote`.

### January 2026

Added
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
- Set up complete Next.js 15 project structure
- Implemented all core pages and components
- Configured Tailwind with orange/slate color scheme

**Decisions made**:
- Port 3050
- Orange primary color (Ian's preference - breaks from gov blue)
- No Clerk/Sentry (not needed for content site)
