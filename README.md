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
├── app.jsx                 # Main app component with routing
├── main.jsx               # Entry point
├── index.css              # Tailwind & DaisyUI styles
├── components/
│   ├── navbar.jsx         # Navigation bar with volume selector
│   ├── sectionDropdown.jsx # Section selector dropdown
│   └── volumeSelector.jsx  # Volume selection logic
├── pages/
│   ├── home.jsx           # Home page
│   ├── characters.jsx     # Characters page
│   ├── characterDetail.jsx # Individual character page
│   ├── places.jsx         # Locations page
│   ├── pathways.jsx       # Pathways page
│   ├── gods.jsx           # Gods page
│   ├── organizations.jsx  # Organizations page
│   ├── spells.jsx         # Spells page
│   ├── sealed_artifacts.jsx # Sealed artifacts page
│   └── volumes.jsx        # Volumes page
├── data/
│   ├── characters/        # Character markdown files (auto-discovered)
│   └── pathways/          # Pathway markdown files (auto-discovered)
├── utils/
│   ├── frontmatter.js     # YAML frontmatter parsing & volume filtering
│   ├── markdownLoader.js  # Dynamic markdown file loading
│   ├── MarkdownRenderer.jsx # Reusable markdown rendering with consistent styling
│   └── characterImages.js # Dynamic character image loading
└── assets/
    └── lotm_logo.webp     # Site logo
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview production build:

```bash
npm run preview
```

### Deploy

Deploy to GitHub Pages:

```bash
npm run deploy
```

## Usage

### Adding Content

The wiki automatically discovers markdown files in `src/data/` directories. No manual imports required!

1. Create markdown files in `src/data/characters/` or `src/data/pathways/`
2. Include frontmatter with metadata:

```markdown
---
name: "Character Name"
introducedInVolume: 0
category: "character"
---

## About
Basic information about character...

:::reveal at=1
## Volume 1 Progress
Content revealed after completing Volume 1...
:::

:::reveal at=2
## Volume 2 Progress  
Content revealed after completing Volume 2...
:::
```

**Styling Notes:**
- Markdown content is rendered with beautiful typography automatically
- Headings use different colors (primary, secondary, accent) with proper spacing
- Lists have a jottings-style appearance with hover effects
- No custom CSS needed - everything is handled by the MarkdownRenderer utility

### Progressive Content Reveal

The wiki supports spoiler-free content using the `reveal` block syntax:

- **Basic content**: Always visible to all users
- **`:::reveal at=X` blocks**: Content hidden until user reaches volume X+1
- **Volume numbering**: 0 = Introduction, 1 = Volume 1, 2 = Volume 2, etc.

**Example for a character's progression:**
```markdown
**Current Sequence:** 9 - Seer

:::reveal at=1
**Updated Sequence:** 8 - Clown
**New Abilities:** Enhanced agility, emotional manipulation
:::

:::reveal at=2
**Final Sequence:** 7 - Magician  
**Special Status:** Demigod Candidate
**New Abilities:** Portal creation, advanced spell casting
:::
```

This allows users to safely browse without spoilers while progressively revealing more content as they advance through the series.

### Volume Filtering

The volume selector in the navbar allows users to:
- Select their current reading progress (Introduction through latest volume)
- Automatically hide content from future volumes using both frontmatter and reveal blocks
- Display only relevant information based on their reading position
- Progressively reveal character development, plot points, and power progressions

**How it works:**
1. **Frontmatter filtering**: Content with `introducedInVolume` higher than selected volume is completely hidden
2. **Reveal blocks**: Content inside `:::reveal at=X` blocks only appears when user reaches volume X+1
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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## License

This project is open source and available under the MIT License.

## Content Management

### File Organization
- **Auto-discovery**: All `.md` files in `src/data/` subdirectories are automatically loaded
- **Categorization**: Files are organized by their containing folder (characters, pathways, etc.)
- **Naming**: Use kebab-case for filenames (e.g., `klein_morreti.md`)
- **Images**: Character images are auto-discovered from `src/assets/characters/`
- **Markdown Rendering**: All content uses the `MarkdownRenderer` utility for consistent styling

### Adding New Categories
1. Create a new folder in `src/data/` (e.g., `organizations/`)
2. Add markdown files with proper frontmatter
3. Create a page component that uses `getCategoryFiles('organizations')` and `MarkdownRenderer`
4. Update navigation as needed

### Content Guidelines
- **Frontmatter**: Always include `name`, `introducedInVolume`, and `category`
- **Volume Numbers**: Use 0 for Introduction, 1 for Volume 1, etc.
- **Reveal Blocks**: Use progressively for character development and plot progression
- **Spoilers**: Tag all future content with appropriate reveal volumes
- **Styling**: Write standard markdown - all formatting is handled automatically

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

When contributing content:
1. Follow the file naming conventions
2. Use proper frontmatter
3. Implement progressive reveals for spoilers
4. Test with different volume selections to ensure proper filtering
