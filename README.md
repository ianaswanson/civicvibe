# CivicVibe

An open source playbook for government teams who want to work the way working software gets made.

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
- **Content**: Markdown with gray-matter, rendered with unified
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Project Structure

```
civicvibe/
├── app/
│   ├── page.tsx                    # Homepage: two doors
│   └── (site)/
│       ├── (door-1)/start, story   # Door 1
│       └── (door-2)/system, templates  # Door 2: the map, docs, templates
├── components/
├── content/
│   ├── system/             # Synced docs + _index.json (generated)
│   └── templates/          # Synced templates (generated)
├── lib/system.ts           # Reads the synced content
├── public/files/           # Synced roadmap visuals (generated)
└── scripts/sync-content.mjs
```

## Adding Content

The docs and templates are written in a separate folder (`~/ai-dev/digital-services/system/`) and copied in by `npm run sync`, which also runs before every build. Don't edit `content/system/`, `content/templates/` or `public/files/` by hand; edit the source and sync. The sync fails if anything outside the project's boundaries is in the text.

## Contributing

CivicVibe is open source under the MIT license. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE file for details.
