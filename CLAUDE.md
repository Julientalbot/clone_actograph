# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ActoGraph Pro is a professional SaaS platform for ergonomic analysis and timing studies designed for workplace research and industrial engineering. It provides a comprehensive suite for recording, analyzing, and visualizing work activities through a modern Next.js application with Supabase backend.

## Architecture

The application follows a modern SaaS architecture with Next.js App Router and the following main areas:

1. **Authentication System** - Supabase-based auth with signup/login/verification
2. **Dashboard Interface** - Protected routes with comprehensive analytics
3. **Workspace Components** - Core timing and activity logging functionality  
4. **Analytics Suite** - Advanced data visualization with Chart.js
5. **PWA Capabilities** - Offline support and native installation

### Key Components:
- **Timer Component** (`Timer.tsx`) - High-precision chronometer for detailed time measurements
- **ActivityPanel Component** (`ActivityPanel.tsx`) - Core activity logging system with predefined categories
- **VideoPlayer Component** (`VideoPlayer.tsx`) - Video analysis interface with drag-and-drop
- **TimelineChart Component** (`TimelineChart.tsx`) - Interactive chronogram visualization
- **AnalyticsDashboard Component** (`AnalyticsDashboard.tsx`) - Advanced charts and statistics
- **SessionManager Component** (`SessionManager.tsx`) - Session lifecycle management

## Technology Stack

### **Backend & Infrastructure**
- **Next.js 15.4.2** - React full-stack framework with App Router
- **Supabase** - Backend-as-a-Service for auth, database, and real-time features
- **TypeScript** - Static typing for enhanced developer experience

### **Frontend & UI** 
- **React 19** - Modern UI library with latest hooks and features
- **Tailwind CSS** - Utility-first CSS with dark mode support
- **Chart.js + React-chartjs-2** - Professional interactive charts
- **Zustand** - Lightweight state management
- **React Hot Toast** - Elegant notification system

### **PWA & Performance**
- **Service Worker** - Offline caching and background sync
- **Web App Manifest** - Native installation capabilities
- **Next.js Optimization** - Automatic code splitting and performance optimization

## Development Commands

All commands should be run from the `saas/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# TypeScript type checking
npx tsc --noEmit
```

## Environment Setup

Create `.env.local` in the `saas/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Development Patterns

### SaaS Architecture
- Next.js App Router for file-based routing and server components
- Supabase integration for authentication, database, and real-time features
- Progressive Web App capabilities with offline support
- TypeScript strict mode for enhanced type safety

### Authentication & Security
- Row Level Security (RLS) policies in Supabase
- Protected routes with automatic redirects
- Email verification and password reset flows
- Organization and team-based access control

### Component Structure
- Server and Client Components following Next.js 13+ patterns
- Custom hooks for shared logic (useAuth, useDarkMode, useServiceWorker)
- Zustand store with persistence and Supabase synchronization
- French localization for workplace context (activity names, UI text)

### Activity System
The ActivityPanel uses a predefined set of 5 ergonomic activity types with color coding:
- Préparation (blue) - Setup and preparation tasks
- Travail principal (green) - Main productive work
- Pause (yellow) - Breaks and rest periods
- Attente (red) - Waiting and blocking time
- Communication (purple) - Discussion and coordination

### Timer Implementation
The Timer component updates every 100ms for high precision and displays time in MM:SS.CS format (minutes:seconds.centiseconds). Data is automatically synced to Supabase in real-time.

### Video Integration
VideoPlayer handles local file uploads with drag-and-drop interface, custom controls for time-motion studies, and correlation with timing data.

### PWA Features
- Service Worker for offline functionality and caching
- App manifest for native installation on desktop and mobile
- Background sync for data synchronization when connection is restored
- Push notifications for session reminders (future feature)

## File Structure

```
saas/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Protected dashboard routes
│   │   │   ├── workspace/      # Main workspace interface
│   │   │   ├── analytics/      # Advanced analytics
│   │   │   └── sessions/       # Session management
│   │   ├── login/              # Authentication pages
│   │   ├── signup/
│   │   └── offline/            # PWA offline page
│   ├── components/             # Reusable React components
│   │   ├── Timer.tsx           # High-precision chronometer
│   │   ├── ActivityPanel.tsx   # Activity logging interface
│   │   ├── VideoPlayer.tsx     # Video analysis with drag-drop
│   │   ├── TimelineChart.tsx   # Interactive chronogram
│   │   ├── AnalyticsDashboard.tsx # Advanced charts
│   │   └── SessionManager.tsx  # Session lifecycle
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication logic
│   │   ├── useDarkMode.ts      # Theme management
│   │   └── useServiceWorker.ts # PWA functionality
│   ├── store/                  # State management
│   │   └── useWorkspaceStore.ts # Zustand store with Supabase sync
│   └── lib/                    # Utilities and configuration
│       ├── supabase.ts         # Supabase client setup
│       └── database.types.ts   # TypeScript database types
├── public/                     # Static assets and PWA files
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons for installation
├── package.json               # Dependencies and scripts
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS with dark mode
└── supabase-setup.sql         # Database initialization script
```

## Styling Guidelines

- Use Tailwind CSS utility classes with dark mode support (`dark:` variants)
- Responsive design with mobile-first approach using Tailwind breakpoints
- Professional gradient-based color scheme suitable for workplace tools
- Glass morphism effects with backdrop-blur for modern UI
- Color-coded activity system for visual organization and accessibility
- Custom component styling with proper TypeScript props

## State Management

- **Zustand** for client-side state with persistence to localStorage
- **Supabase Real-time** for server state synchronization
- **Next.js Server Components** for initial data loading
- **React Query patterns** for server state caching and mutations

## Database Schema

### Core Tables:
- `profiles` - User profiles with organization relationships
- `organizations` - Team/company management
- `sessions` - Analysis sessions with metadata
- `events` - Individual activity events with timing data
- `activities` - Predefined activity types and custom definitions

### Security:
- Row Level Security (RLS) enabled on all tables
- User-based and organization-based access control
- Audit trails for compliance and data integrity

## Testing and Quality

- ESLint with Next.js and TypeScript integration
- TypeScript strict mode with comprehensive type coverage
- Modern React patterns with hooks, server components, and suspense
- Supabase database migrations for schema versioning
- Environment-based configuration for development/production