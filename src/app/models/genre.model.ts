/**
 * Genre Model
 *
 * Represents a movie genre/category from TMDB API.
 *
 * Used in:
 * - CategoriesService: To fetch and manage movie genres
 * - MovieDetails: To display genre information for a specific movie
 * - CategoryPage: To display available movie categories
 * - HomePage: For category filtering and navigation
 *
 * @interface Genre
 */
export interface Genre {
    /** Unique identifier for the genre in TMDB */
    id: number;

    /** Display name of the genre (e.g., "Action", "Comedy", "Drama") */
    name: string;
}
