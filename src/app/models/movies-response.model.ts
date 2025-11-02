import { Movie } from './movie.model';

/**
 * Movies Response Model
 *
 * Represents the paginated response structure from TMDB API when fetching movies.
 *
 * Used in:
 * - MoviesService: To handle paginated movie data from TMDB API endpoints
 * - HomePage: When fetching trending and popular movies
 * - CategoryPage: When fetching movies by genre/category
 *
 * @interface MoviesResponse
 */
export interface MoviesResponse {
    /** Current page number in the paginated response */
    page: number;

    /** Array of movie objects in the current page */
    results: Movie[];

    /** Total number of pages available */
    total_pages: number;

    /** Total number of results across all pages */
    total_results: number;
}
