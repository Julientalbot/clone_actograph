# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ActoGraph Clone is an ergonomic analysis and timing tool designed for workplace studies and industrial engineering. It provides a comprehensive suite for recording, analyzing, and visualizing work activities through a React-based web application.

## Architecture

The application follows a component-based architecture with four main functional areas:

1. **Timer Component** (`Timer.tsx`) - High-precision chronometer for detailed time measurements
2. **ActivityPanel Component** (`ActivityPanel.tsx`) - Core activity logging system with predefined categories
3. **VideoPlayer Component** (`VideoPlayer.tsx`) - Video analysis interface for recording work activities
4. **TimelineChart Component** (`TimelineChart.tsx`) - Data visualization for activity timelines and statistics

The main application (`App.tsx`) orchestrates these components in a responsive two-column layout.

## Technology Stack

- **Frontend**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4 with React plugin
- **Styling**: Tailwind CSS 4.1.11 with PostCSS and Autoprefixer
- **Video**: Video.js library for enhanced video handling
- **Linting**: ESLint with TypeScript, React Hooks, and React Refresh plugins

## Development Commands

All commands should be run from the `client/` directory:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# TypeScript type checking
npx tsc --noEmit
```

## Key Development Patterns

### Component Structure
- Functional components with React hooks for state management
- TypeScript interfaces for type safety
- French localization for workplace context (activity names, UI text)

### Activity System
The ActivityPanel uses a predefined set of 5 activity types with color coding:
- Préparation (blue)
- Travail principal (green) 
- Pause (yellow)
- Attente (red)
- Communication (purple)

### Timer Implementation
The Timer component updates every 100ms for high precision and displays time in MM:SS.CS format (minutes:seconds.centiseconds).

### Video Integration
VideoPlayer handles local file uploads with drag-and-drop interface and custom controls for time-motion studies.

## File Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── ActivityPanel.tsx
│   │   ├── Timer.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── TimelineChart.tsx
│   ├── App.tsx             # Main application
│   ├── main.tsx            # React entry point
│   └── assets/             # Static assets
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── tsconfig.json           # TypeScript configuration
```

## Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Custom button classes: `btn-primary`, `btn-secondary`, `btn-danger`
- Color-coded activity system for visual organization
- Responsive design with mobile-first approach
- Professional color scheme suitable for workplace tools

## Testing and Quality

- ESLint with TypeScript integration for code quality
- React Hooks and React Refresh plugins for development
- TypeScript strict mode for type safety
- Modern React patterns with hooks and functional components