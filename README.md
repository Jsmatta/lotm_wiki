# LOTM Wiki

A comprehensive wiki for **Lord of the Mysteries** series, built with Preact and Tailwind CSS. Filter content by volume to avoid spoilers and explore detailed information about characters, pathways, organizations, and more.

## Features

- 📚 **Volume-Based Content Filtering** - Hide content you haven't reached yet
- 🔍 **Search Functionality** - Find characters, locations, and lore quickly
- 🎨 **Dark Theme** - Eye-friendly interface powered by DaisyUI
- 📖 **Natural Markdown Rendering** - Beautiful typography with professional styling
- ⚡ **Fast & Responsive** - Built with Preact for optimal performance
- 🗺️ **Multi-Page Navigation** - Dedicated pages for different content types
- 🚀 **Client-Side Routing** - Smooth navigation with React Router
- 🔄 **Auto-Discovery** - Markdown files are automatically loaded without manual imports
- 🎯 **Consistent Styling** - Jottings-style formatting and enhanced typography

## Project Structure

```
src/
├── app.jsx                 # App shell; generates routes from the category registry
├── main.jsx                # Entry point
├── index.css               # Tailwind & DaisyUI styles
├── config/
│   ├── categories.js       # Single source of truth for every content category
│   ├── volumes.js          # Canonical volume list + clamping helpers
│   └── icons.js            # Shared SVG path data
├── components/
│   ├── navbar.jsx          # Navigation bar with volume selector
│   ├── sectionDropdown.jsx # Section selector dropdown
│   ├── volumeSelector.jsx  # Volume selection dropdown
│   ├── wikiListPage.jsx    # Grid/search view shared by every category
│   ├── wikiDetailPage.jsx  # Single-entry view shared by every category
│   ├── icon.jsx            # Shared outline-SVG wrapper
│   ├── modal.jsx           # Focus-trapping modal used by both dropdowns
│   ├── loadingPage.jsx     # Loading state
│   └── errorBoundary.jsx   # Top-level error boundary
├── pages/                  # Only the non-category pages
│   ├── home.jsx
│   ├── volumes.jsx
│   ├── search.jsx
│   └── notFound.jsx
├── data/
│   └── <category>/         # Markdown files, auto-discovered by folder
├── utils/
│   ├── frontmatter.js      # YAML frontmatter parsing & volume filtering
│   ├── markdownLoader.js   # Auto-discovery + one-time parse of every .md file
│   ├── wikiContent.js      # Volume-filtered, render-ready items
│   ├── wikiReferences.js   # Linkable page index per volume
│   ├── autoLinkReferences.js # Remark plugin that cross-links wiki names
│   ├── MarkdownRenderer.jsx  # Reusable markdown rendering with consistent styling
│   ├── imageLoader.js      # Image URL lookup by slugified name
│   └── useAsyncData.js     # Cancellation-safe async loading hook
└── assets/
    ├── <category>/         # Images, matched to entries by slugified name
    └── lotm_logo.webp      # Site logo
```

Content categories are declared once in `src/config/categories.js`; routes,
navigation, home-page cards, and content validation are all derived from it.

## Getting Started

### Prerequisites

- Bun (latest)

### Installation

```bash
bun install
```

### Development

Start the development server:

```bash
bun dev
```

The site will be available at `http://localhost:5173`

### Build

Build for production:

```bash
bun run build
```

### Preview

Preview production build:

```bash
bun run preview
```

### Deploy

Deploy to GitHub Pages:

```bash
bun run deploy
```

## Usage

### Adding Content

The wiki automatically discovers markdown files in `src/data/` directories. No manual imports required!

1. Create a Markdown file in the matching `src/data/<category>/` directory
2. Include frontmatter with metadata:

```markdown
---
name: "Character Name"
introducedInVolume: 0
category: "character"
---

## About
Basic information about character...

:::spoiler volume=1
## Volume 1 Progress
Content visible when the reader selects volume index 1 or later.
:::

:::spoiler volume=2
## Volume 2 Progress  
Content visible when the reader selects volume index 2 or later.
:::
```

**Styling Notes:**
- Markdown content is rendered with beautiful typography automatically
- Headings use different colors (primary, secondary, accent) with proper spacing
- Lists have a jottings-style appearance with hover effects
- No custom CSS needed - everything is handled by the MarkdownRenderer utility

### Progressive Content Reveal

The wiki supports spoiler-safe content with fenced spoiler blocks. The
recommended syntax is `:::spoiler volume=X`; the original
`:::reveal at=X` syntax remains supported.

- **Basic content**: Always visible after the page itself is available
- **Spoiler blocks**: Visible when the selected volume index is at least `X`
- **Volume numbering**: Uses the selector index: `0` = Introduction,
  `1` = The Clown, `2` = The Faceless, and so on
- **Fail-closed parsing**: Invalid or unclosed spoiler blocks are hidden so
  malformed content does not accidentally expose spoilers

Both forms below are equivalent:

```markdown
:::spoiler volume=2
This appears at index 2 (The Faceless) and later.
:::

:::reveal at=2
This also appears at index 2 and later.
:::
```

**Example for a character's progression:**

```markdown
**Current Sequence:** 9 - Seer

:::spoiler volume=1
**Updated Sequence:** 8 - Clown
**New Abilities:** Enhanced agility, emotional manipulation
:::

:::spoiler volume=2
**Final Sequence:** 7 - Magician  
**Special Status:** Demigod Candidate
**New Abilities:** Portal creation, advanced spell casting
:::
```

Spoiler blocks may be nested. A nested block is shown only when both its own
volume and every parent block are visible:

```markdown
:::spoiler volume=1
Visible from The Clown onward.

:::spoiler volume=3
Visible from The Traveler onward.
:::
:::
```

Flexible whitespace and quoted numbers are accepted:

```markdown
  :::spoiler volume = "2"
  This is valid.
  :::
```

Directive-looking text inside fenced code blocks is preserved as an example
and is not interpreted. Opening and closing directives must otherwise be on
their own lines.

When authoring content:

1. Put public context outside spoiler blocks.
2. Wrap every later development, identity, power, relationship, or plot fact
   in the earliest matching volume block.
3. Close each block with `:::` on its own line.
4. Run `bun test` to check parser behavior and test multiple selector values
   in the browser.

### Volume Filtering

The volume selector in the navbar allows users to:
- Select their current reading progress (Introduction through latest volume)
- Automatically hide content from future volumes using both frontmatter and reveal blocks
- Display only relevant information based on their reading position
- Progressively reveal character development, plot points, and power progressions

**How it works:**
1. **Frontmatter filtering**: Content with `introducedInVolume` higher than selected volume is completely hidden
2. **Spoiler blocks**: Content inside a block appears when
   `selectedVolume >= volume`
3. **Safe browsing**: Users can explore characters and concepts without encountering future spoilers

### Sections

Available content sections:
- Characters
- Places
- Pathways
- Gods
- Organizations
- Spells
- Sealed Artifacts

## Technologies

- **[Preact](https://preactjs.com/)** - Lightweight React alternative
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Safe and customizable markdown rendering
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)** - Beautiful markdown typography
- **[DaisyUI](https://daisyui.com/)** - Tailwind CSS component library
- **[Vite](https://vitejs.dev/)** - Next generation frontend build tool with dynamic imports
- **Custom Markdown Loader** - Dynamic file discovery and loading system
- **[GH Pages](https://github.com/tschaub/gh-pages)** - GitHub Pages deployment

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run deploy` - Deploy to GitHub Pages

## License

This project is open source and available under the MIT License.

## Content Management

### File Organization
- **Auto-discovery**: All `.md` files in `src/data/` subdirectories are automatically loaded
- **Categorization**: Files are organized by their containing folder (characters, pathways, etc.)
- **Naming**: Use kebab-case for filenames (e.g., `klein_morreti.md`)
- **Images**: All images are auto-discovered from `src/assets/{category}/` folders using the universal image loader
- **Markdown Rendering**: All content uses the `MarkdownRenderer` utility for consistent styling

### Adding New Categories

1. Add one entry to `CATEGORIES` in `src/config/categories.js`:

```javascript
{
  key: "artifacts",              // folder name under src/data/ and src/assets/
  route: "/artifacts",           // URL segment; may differ from the folder name
  title: "Artifacts",
  singular: "Artifact",
  description: "Shown at the top of the list page.",
  icon: "M13 10V3L4 14h7v7l9-11h-7z",   // outline SVG path data
}
```

2. Create `src/data/artifacts/` and add markdown files with proper frontmatter.
3. Create `src/assets/artifacts/` and add one image per entry.
4. Run `bun test`.

Routes, the navigation dropdown, the home-page card, and content validation are
all generated from that entry — there is no page component to write and nothing
to register in `src/app.jsx`.

### Image Management

Images are matched to entries by slugifying the frontmatter `name`
(lowercased, spaces to underscores, other characters dropped):

```
name: "Klein Moretti"  ->  src/assets/characters/klein_moretti.webp
```

**File Organization:**
- Place images in `src/assets/{category}/`, one per entry
- Name the file after the slugified `name`, **not** the markdown filename
- Supported formats: webp, jpg, jpeg, png, svg, avif, gif
- Discovery is automatic; `bun test` fails if an entry has no matching image

### Content Guidelines
- **Frontmatter**: Always include `name`, `introducedInVolume`, and `category`
- **Volume Numbers**: Use 0 for Introduction, 1 for Volume 1, etc.
- **Spoiler Blocks**: Prefer `:::spoiler volume=X`; `:::reveal at=X` is kept
  for backwards compatibility
- **Spoilers**: Tag all future content with appropriate reveal volumes
- **Styling**: Write standard markdown - all formatting is handled automatically

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

When contributing content:
1. Follow the file naming conventions
2. Use proper frontmatter
3. Implement progressive reveals for spoilers
4. Test with different volume selections to ensure proper filtering
