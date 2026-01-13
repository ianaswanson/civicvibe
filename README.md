# CivicVibe

Free, open-source resources helping local government teams harness AI and digital transformation.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (port 3050)
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Content**: MDX with gray-matter
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Project Structure

```
civicvibe/
├── app/                    # Next.js App Router pages
│   ├── articles/           # Article listing and detail
│   ├── resources/          # Guides and templates
│   ├── projects/           # Open source showcase
│   ├── about/              # About page
│   └── contact/            # Contact page
├── components/             # React components
├── content/
│   └── articles/           # MDX article files
├── lib/
│   └── mdx.ts              # MDX utilities
└── public/                 # Static assets
```

## Adding Content

### Articles

Create MDX files in `content/articles/`:

```mdx
---
title: "Your Article Title"
description: "Brief description for previews"
date: "2026-01-11"
category: "Guide"
tags: ["ai", "transformation"]
---

Your content here...
```

## Contributing

CivicVibe is open source under the MIT license. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE file for details.
