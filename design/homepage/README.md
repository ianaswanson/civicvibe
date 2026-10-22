# Homepage design prototype

The approved homepage design (Oct 22, 2026): the door in the tree, the fall down the passage, and the hall of two doors. It's one static HTML file, the reference for porting into the Next.js homepage at `/`.

## View it

Run the `design-prototype` config in `.claude/launch.json`, then open http://localhost:3060/. Opening `index.html` from `file://` in the app's built-in browser drops the images.

## What's here

- `index.html`: the page. Copy is final and matches BRAND.md's opener.
- `img/`: the engravings the page uses, all generated with Gemini in the style of John Tenniel's 1865 Alice illustrations.
- `CRITIC-PROMPT-v2.md`: the critic prompt that ranks the page against reference sites from screenshots. `CRITIC-PROMPT.md` is the earlier version, which judged against an imagined studio bar instead.

## Making more images

```bash
op run --env-file=.env.op -- node scripts/gen-image.mjs design/homepage/img/<name>.png 3:4 "<prompt>"
```

End every prompt with: "Black-and-white wood engraving in the style of John Tenniel's 1865 book illustrations, fine cross-hatching and crisp black linework, high contrast, pure white background, no text, no lettering, no signature, no border, not a likeness of a real person."

## Not done

The port to Next.js, a Safari test of the scroll push-in, and a close check of tablet widths. Tracked in issue #1.
