/**
 * Models Index
 *
 * Central export file for all application models/interfaces.
 * Import models from this file to maintain clean and organized imports.
 *
 * Usage example:
 * import { Movie, Genre, UserProfile } from '../models';
 */

// Movie related models
export * from './movie.model';
export * from './movie-details.model';
export * from './movie-display.model';
export * from './movies-response.model';

// Genre and Category models
export * from './genre.model';
export * from './genres-response.model';
export * from './category.model';

// Credits models
export * from './cast.model';
export * from './crew.model';
export * from './credits.model';

// Production models
export * from './production-company.model';

// Favorites models
export * from './favorite-movie.model';
export * from './favorite-movie-display.model';

// User models
export * from './user-profile.model';
