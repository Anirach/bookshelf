# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal book management system built with Next.js 16 App Router. Users can track their reading progress, manage their book collection, and organize books by authors and genres.

## Technology Stack

- **Frontend**: Next.js 16.1.6 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components (New York style)
- **Database**: Prisma ORM with LibSQL adapter (SQLite for local development)
- **UI Components**: Radix UI primitives via shadcn/ui, Lucide React icons
- **Validation**: React Hook Form with Zod (as needed)

## Common Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

### Database Operations
```bash
npx prisma generate              # Generate Prisma Client
npx prisma migrate dev           # Create and apply migrations
npx prisma migrate dev --name <name>  # Create named migration
npx prisma db push              # Push schema changes without migration
npx prisma db seed              # Seed database with sample data
npx prisma studio               # Open Prisma Studio (database GUI)
```

## Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Dashboard (homepage)
│   └── books/
│       ├── page.tsx       # Books list view
│       ├── new/page.tsx   # Add new book form
│       └── [id]/
│           ├── page.tsx   # Book detail view
│           └── edit/page.tsx  # Edit book form
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── db.ts             # Prisma client singleton
│   ├── actions.ts        # Server Actions for data mutations
│   └── utils.ts          # Utility functions (cn, etc.)
└── app/globals.css       # Global styles and Tailwind config
```

### Data Model (Prisma Schema)

The database uses three main entities:
- **Book**: Core entity with title, status (want-to-read/reading/completed), progress tracking, ratings, notes
- **Author**: Book authors with optional bio
- **Genre**: Book categories with custom colors for UI display

Key relationships:
- Books belong to one Author (optional)
- Books belong to one Genre (optional)
- Authors have many Books
- Genres have many Books

### Server Actions Pattern

This project uses Next.js Server Actions for all data mutations (located in [src/lib/actions.ts](src/lib/actions.ts)):

```typescript
'use server'
import prisma from './db'
import { revalidatePath } from 'next/cache'

export async function createBook(data) { /* ... */ }
export async function updateBook(id, data) { /* ... */ }
export async function deleteBook(id) { /* ... */ }
```

**Important patterns:**
- All server actions are marked with `'use server'` directive
- Actions automatically revalidate relevant paths using `revalidatePath()`
- Always include related data with `include: { author: true, genre: true }` when fetching books
- Client components call these actions directly (no API routes needed)

### Database Connection

Prisma client is configured as a singleton in [src/lib/db.ts](src/lib/db.ts) to prevent connection exhaustion in development:

```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Always import from `@/lib/db` rather than creating new PrismaClient instances.

### UI Components

The project uses shadcn/ui with the "New York" style variant. Components are in [src/components/ui/](src/components/ui/).

**Adding new components:**
```bash
npx shadcn@latest add <component-name>
```

Configuration is in [components.json](components.json) with path aliases:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/utils` → `src/lib/utils`

### Styling

- The app uses dark mode by default (see `className="dark"` in [src/app/layout.tsx](src/app/layout.tsx))
- Tailwind v4 with CSS variables for theming
- Use the `cn()` utility from [src/lib/utils.ts](src/lib/utils.ts) for conditional classes

## Development Workflow

### Adding New Features

1. **Database changes**: Update [prisma/schema.prisma](prisma/schema.prisma), then run `npx prisma migrate dev`
2. **Server Actions**: Add data operations to [src/lib/actions.ts](src/lib/actions.ts)
3. **UI**: Create pages in `src/app/` following the App Router conventions
4. **Components**: Add reusable UI in `src/components/` or install shadcn/ui components

### Working with Forms

Forms typically use native HTML forms with Server Actions:
```tsx
<form action={createBook}>
  <input name="title" required />
  <button type="submit">Add Book</button>
</form>
```

For complex validation, use React Hook Form with Zod (not yet implemented but dependencies are available).

### Database Seeding

The [prisma/seed.ts](prisma/seed.ts) file contains sample data with authors, genres, and books. Run `npx prisma db seed` to populate the database. Modify this file when you need different seed data.

## Important Notes

- **LibSQL Adapter**: The project uses `@prisma/adapter-libsql` for compatibility with Turso (LibSQL cloud) but runs SQLite locally
- **No API Routes**: This project uses Server Actions exclusively - there are no `/api` routes
- **Server Components by Default**: All components in `app/` are Server Components unless marked with `'use client'`
- **Path Revalidation**: Always call `revalidatePath()` after mutations to update cached data

## Book Status Values

The `status` field on books accepts these values:
- `want-to-read` (default)
- `reading`
- `completed`

These are hardcoded strings in the schema, not an enum.
