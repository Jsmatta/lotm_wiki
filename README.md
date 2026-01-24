# LOTM Wiki

A comprehensive wiki for the **Lord of the Mysteries** series, built with Preact and Tailwind CSS. Filter content by volume to avoid spoilers and explore detailed information about characters, pathways, organizations, and more.

## Features

- 📚 **Volume-Based Content Filtering** - Hide content you haven't reached yet
- 🔍 **Search Functionality** - Find characters, locations, and lore quickly
- 🎨 **Dark Theme** - Eye-friendly interface powered by DaisyUI
- 📖 **Markdown Support** - Rich content with frontmatter metadata
- ⚡ **Fast & Responsive** - Built with Preact for optimal performance
- 🗺️ **Multi-Page Navigation** - Dedicated pages for different content types
- 🚀 **Client-Side Routing** - Smooth navigation with React Router

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
│   ├── places.jsx         # Locations page
│   ├── pathways.jsx       # Pathways page
│   ├── gods.jsx           # Gods page
│   ├── organizations.jsx  # Organizations page
│   ├── spells.jsx         # Spells page
│   ├── sealed_artifacts.jsx # Sealed artifacts page
│   └── volumes.jsx        # Volumes page
├── data/
│   ├── characters/        # Character markdown files
│   └── pathways/          # Pathway markdown files
├── utils/
│   └── markdown.js        # Markdown parsing & volume filtering
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

1. Create markdown files in `src/data/characters/` or `src/data/pathways/`
2. Include frontmatter with metadata:

```markdown
---
name: "Character Name"
introducedInVolume: 1
category: "character"
---

## Volume 1
Content for volume 1...

## Volume 2
Content for volume 2...
```

### Volume Filtering

The volume selector in the navbar allows users to:
- Select their current reading progress
- Automatically hide content from future volumes
- Display only relevant information

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
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI](https://daisyui.com/)** - Tailwind CSS component library
- **[Vite](https://vitejs.dev/)** - Next generation frontend build tool
- **[Marked](https://marked.js.org/)** - Markdown parser
- **[Gray Matter](https://github.com/jonschlinkert/gray-matter)** - YAML frontmatter parser
- **[GH Pages](https://github.com/tschaub/gh-pages)** - GitHub Pages deployment

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.
