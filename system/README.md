# Digital services system

The official documents for how a digital services team works: from capturing ideas to setting direction, planning the quarter, discovering, building, releasing and enabling. Each document is written for people and for AI agents to read. Every example follows the same fictional Oregon DMV digital service.

This folder is the source of truth; the site at civicvibe.org is rendered from it (`npm run sync`). The map of the system (process flow, artifacts, request triage, team rhythm, roles) lives on the FigJam board, "Digital services system," until it is redrawn here. The working files and source material these documents were built from are private and stay out of this repo.

## Documents

| # | Document | Status |
|---|---|---|
| 00 | [Glossary](00-glossary.md) | Draft |
| 01 | [Shared terms and artifacts](01-shared-terms-and-artifacts.md) | Draft |
| 02 | [Why digital services](02-why-digital-services.md) | Draft |
| 03 | [Vision and strategy](03-vision-and-strategy.md) | Draft |
| 04 | [Goals and goal progress](04-goals-and-goal-progress.md) | Draft |
| 05 | [Now, Next, Later grid](05-now-next-later-grid.md) | Draft |
| 06 | [Quarterly planning and commitments](06-quarterly-planning-and-commitments.md) | Draft |
| 07 | [Sprint report](07-sprint-report.md) | Draft |
| 08 | [Request triage and the idea log](08-request-triage-and-idea-log.md) | Draft |
| 09 | [Initiatives and solutions](09-initiatives-and-solutions.md) | Draft |
| 10 | [Discovery](10-discovery.md) | Draft |
| 11 | [Deliverables and user stories](11-deliverables-and-user-stories.md) | Draft |
| 12 | [Build, release and enable](12-build-release-and-enable.md) | Draft |
| 13 | [Team rhythm](13-team-rhythm.md) | Draft |
| 14 | [Roles and decision rights](14-roles-and-decision-rights.md) | Draft |
| 15 | [Leading the change](15-leading-the-change.md) | Draft |
| 16 | Agent setup | Later |
| 17 | Reference library | Not yet drafted |

Doc 02 holds the story and the conversations; doc 15 holds the rollout sequence: who hears what, in what order, and the first quarter.

## Templates

One file per artifact in [templates/](templates/README.md): a blank template and a filled DMV example.

## Where each thing lives

- **Words:** the [Glossary](00-glossary.md). Nothing else defines terms.
- **How each part works:** the numbered documents.
- **Fields and filled DMV examples:** [templates/](templates/README.md). Each artifact's fields and its filled example live there once. The numbered documents link to them and keep only the lesson.
- **Visuals:** the FigJam board, "Digital services system." The files are the source of truth and the board is drawn from them. When a file changes, check the chapters listed below in the same sitting, and re-export any chapter in [visuals/board/](visuals/board/board.json), which is what the site shows.

| File changed | Board chapters to check |
|---|---|
| 00 Glossary | 3, 4, 8 |
| 01 Shared terms and artifacts | 1, 3 |
| 02 Why digital services | 9 |
| 03, 04, 05 Strategy, goals, grid | 7, 8 |
| 06 Quarterly planning | 2a, 8 |
| 07 Sprint report | 2c, 4, 7 |
| templates/roadmap.md (fields or DMV example) | 4 and 7 (the roadmap visuals), plus the HTML copies in [visuals/roadmap/](visuals/roadmap/) |
| 08 Request triage | 2d |
| 09, 10 Initiatives, discovery | 2b, 7 |
| 11 Deliverables and stories | 2b, 3, 7 |
| 12 Build, release, enable | 2b |
| 13 Team rhythm | 5 |
| 14 Roles | 6, 10 |
| Any template | 4, plus 10 if a DMV example changed |

## Settled terms

The [Glossary](00-glossary.md) is the authority. The short list below is the core.


- **Artifacts**, not records.
- Artifact chain: Idea → Initiative (the tracked bet on an outcome) → Solutions (the ways we try to reach it, kept or dropped) → Deliverable (a tangible thing handed over; on the roadmap, a slice of a Solution this quarter) → User story. Epics are optional team containers for grouping stories, outside the chain.
- The roadmap is one document: Vision and strategy; Goals and goal progress; Now, Next, Later grid; Quarterly commitments; Sprint report.
- The Now, Next, Later grid is first a set of time horizons: Now is this quarter, Next the following two, Later beyond. The items get less concrete with distance: Deliverables in Now, mostly Solutions in Next, Initiatives in Later. Tying horizon to artifact type is Ian Swanson's addition to Janna Bastow's model.
- Work types: Strategic, Technical maintenance, Small requests (50/25/25 by default, set each quarter).
- Status labels: Committed, On track, Off track, Done.
- Delivery types (how a Deliverable lands): Release, In service, Hand off. Separate from work type.
- Process flow: 1 Capture ideas, 2 Set direction, 3 Plan the quarter, 4 Discover, 5 Slice the work, 6 Build and release, 7 Review the sprint, 8 Enable.
