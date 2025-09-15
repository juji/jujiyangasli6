# AI Coding Assistant Instructions for jujiyangasli.com v6

## Architecture Overview

This is a Next.js 15 portfolio website with sophisticated WebGL animations. Key architectural decisions:

- **Static Export**: Uses `output: "export"` in `next.config.ts` for static site generation
- **Cross-Origin Isolation**: COEP/COOP headers required for WebGL/WebGPU features (see `next.config.ts`, `vercel.json`)
- **WebGL Worker System**: Offscreen canvas rendering in Web Workers for performance (`src/worker/webgl.ts`, `src/worker/WebGLHandler.ts`)
- **App Router**: Uses Next.js App Router with route groups (`(main)`, `(nolayout)`)
- **Component Architecture**: Data-driven sections with TypeScript interfaces (`src/data/`, `src/components/sections/`)

## Developer Workflows

### Development
```bash
pnpm dev  # Uses Turbopack (--turbopack flag in package.json)
```

### Code Quality
```bash
pnpm lint     # Biome check (includes formatting)
pnpm format   # Biome format --write
```

### Build & Deploy
```bash
pnpm build    # Next.js static export build
pnpm start    # Serve production build locally
```
- Pre-commit hooks via Husky run lint-staged (Biome on `src/**/*.{js,ts,tsx,css}`)
- Deploys to Vercel with custom headers for cross-origin isolation

## Project Conventions

### Path Aliases
- Use `@/` for `src/` imports (configured in `tsconfig.json`)
- Example: `import { Hero } from "@/components/sections/hero"`

### Component Patterns
- Client components marked with `"use client"` directive
- CSS Modules with `style.module.css` files
- Data-driven components using TypeScript interfaces from `src/data/`
- Custom hooks in `src/hooks/`, utilities in `utils/`

### Styling
- CSS custom properties for theming (`src/app/globals.css`)
- Custom text shadows and drop shadows defined as CSS variables
- Sanitize.css for consistent cross-browser reset
- Responsive design with CSS custom properties for breakpoints

### WebGL Animation System
- Physics-based particle system with bouncing balls
- Instanced WebGL2 rendering for performance
- Scroll-driven animation state (`BgCanvas` component)
- Color grading and post-processing effects
- Worker-based rendering to avoid blocking main thread

### Dependencies
- **Motion**: Animation library (replaces Framer Motion)
- **Lenis**: Smooth scrolling library
- **PhotoSwipe**: Image gallery component
- **Serwist**: Service worker framework (replaces Workbox)
- **Biome**: Linting and formatting (replaces ESLint + Prettier)

### Data Structure
- Works, techs, and play sections use typed data structures
- Images with multiple sizes (thumbnail, small, full) and dimensions
- Logo assets with width/height metadata
- Content rendered via `react-markdown` with `rehype-external-links`

### Performance Optimizations
- Web Workers for WebGL rendering
- Offscreen canvas API
- Static export for CDN deployment
- Service worker for caching
- Turbopack for fast development builds

## Integration Points

### External Services
- Vercel for hosting with custom headers
- GitHub for source code linking

### Cross-Component Communication
- Scroll progress drives WebGL animation state
- CSS custom properties for dynamic theming
- Motion values for scroll-based interactions

### Build Pipeline
- Biome for code quality (lint + format)
- Husky for git hooks
- lint-staged for pre-commit checks
- TypeScript with strict mode and custom types for WebGL/WebGPU
