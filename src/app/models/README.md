# Models Directory

This directory contains all TypeScript interfaces and type definitions used throughout the application. Each model is defined in its own file with comprehensive documentation.

## Directory Structure

```
models/
├── index.ts                              # Central export file for all models
├── movie.model.ts                        # Basic movie interface from TMDB
├── movie-details.model.ts                # Detailed movie information
├── movie-display.model.ts                # UI-optimized movie display
├── movies-response.model.ts              # Paginated movie response
├── genre.model.ts                        # Movie genre/category
├── genres-response.model.ts              # Genres API response
├── category.model.ts                     # Extended category with UI data
├── cast.model.ts                         # Movie cast member
├── crew.model.ts                         # Movie crew member
├── credits.model.ts                      # Complete movie credits
├── production-company.model.ts           # Production company info
├── favorite-movie.model.ts               # Firestore favorite movie
├── favorite-movie-display.model.ts       # UI-optimized favorite display
├── user-profile.model.ts                 # User authentication profile
└── README.md                             # This file
```

## Model Categories

### 🎬 Movie Models

- **`movie.model.ts`** - Basic movie data from TMDB API
- **`movie-details.model.ts`** - Comprehensive movie information including budget, revenue, runtime
- **`movie-display.model.ts`** - Simplified movie data for UI components
- **`movies-response.model.ts`** - Paginated response wrapper for movie lists

### 🎭 Genre & Category Models

- **`genre.model.ts`** - Movie genre (id and name)
- **`genres-response.model.ts`** - API response containing all genres
- **`category.model.ts`** - Extended category with icon, color, and description

### 👥 Credits Models

- **`cast.model.ts`** - Actor/actress information
- **`crew.model.ts`** - Director, producer, and crew information
- **`credits.model.ts`** - Complete credits (cast + crew)

### 🏢 Production Models

- **`production-company.model.ts`** - Production company details

### ⭐ Favorites Models

- **`favorite-movie.model.ts`** - Favorite movie stored in Firestore
- **`favorite-movie-display.model.ts`** - Simplified favorite for display

### 👤 User Models

- **`user-profile.model.ts`** - User authentication and profile data

## Usage

### Importing Models

Always import models from the index file for clean and consistent imports:

```typescript
// ✅ Good - Import from index
import { Movie, Genre, UserProfile } from "../models";

// ❌ Avoid - Direct file imports
import { Movie } from "../models/movie.model";
import { Genre } from "../models/genre.model";
```

### Using Models in Services

Services re-export models for backward compatibility:

```typescript
// In a service file
import { Movie, MoviesResponse } from "../models";

// Re-export for consumers
export { Movie, MoviesResponse } from "../models";
```

### Using Models in Components

```typescript
import { Component } from "@angular/core";
import { Movie, Genre, FavoriteMovieDisplay } from "../../models";

export class MyComponent {
  movies: Movie[] = [];
  genres: Genre[] = [];
  favorites: FavoriteMovieDisplay[] = [];
}
```

## Model Documentation

Each model file includes:

- **Interface definition** with all properties
- **JSDoc comments** explaining the purpose
- **Property documentation** for each field
- **Usage information** listing where the model is used

## Best Practices

### 1. Single Responsibility

Each interface should have a single, clear purpose.

### 2. Naming Conventions

- Use PascalCase for interface names
- Use camelCase for property names
- Suffix model files with `.model.ts`
- Use descriptive names (e.g., `MovieDetails` not `MovieInfo`)

### 3. Documentation

- Always include JSDoc comments
- Document all properties
- List all files that use the interface
- Explain any complex or optional fields

### 4. Type Safety

- Use strict types (avoid `any`)
- Mark optional fields with `?`
- Use union types when appropriate (`string | null`)
- Define enums for fixed value sets

### 5. Reusability

- Share common interfaces through imports
- Extend existing interfaces when needed
- Use composition over duplication

## Model Relationships

```
Movie ──────────────┐
                    ├─→ MoviesResponse
                    │
MovieDetails ───────┼─→ Credits ──┬─→ Cast
       │            │             └─→ Crew
       ├─→ Genre    │
       └─→ ProductionCompany
                    │
FavoriteMovie ──────┘
       │
       └─→ FavoriteMovieDisplay

Category ──→ Genre

UserProfile (used in authentication)
```

## Adding New Models

When adding a new model:

1. Create a new file: `{model-name}.model.ts`
2. Add comprehensive JSDoc documentation
3. Export from `index.ts`
4. Update this README with the new model
5. Update imports in relevant services/components

Example:

```typescript
/**
 * Example Model
 *
 * Brief description of what this model represents.
 *
 * Used in:
 * - ServiceName: How it's used
 * - ComponentName: How it's used
 *
 * @interface ExampleModel
 */
export interface ExampleModel {
  /** Property description */
  id: number;

  /** Another property description */
  name: string;

  /** Optional property */
  description?: string;
}
```

## Migration Notes

All interfaces have been migrated from their original locations to this centralized models directory:

- **From services**: `movies.service.ts`, `categories.service.ts`, `favorites.service.ts`
- **From components**: `movie-details.page.ts`, `category.page.ts`, `home.page.ts`, `movies-list.page.ts`, `profile.page.ts`

Services maintain re-exports for backward compatibility, but new code should import directly from `models`.

## Type Aliases

Some components use type aliases for clarity:

```typescript
// In home.page.ts
import { MovieDisplay } from "../../models";
type Movie = MovieDisplay; // Local alias for component context
```

This allows components to use `Movie` while the actual type is `MovieDisplay`.
