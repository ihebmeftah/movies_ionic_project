/**
 * Movie Display Model
 *
 * Simplified interface for displaying movies in the UI with local state.
 * This interface transforms TMDB movie data into a format optimized for display.
 *
 * Used in:
 * - HomePage: To display movies in the home feed
 * - MoviesListPage: To display movies in list views
 * - Category views: When showing movies filtered by category
 *
 * @interface MovieDisplay
 */
export interface MovieDisplay {
    /** TMDB movie ID */
    id: number;

    /** Title of the movie */
    title: string;

    /** Full poster URL or path */
    poster: string;

    /** Average rating (0-10 scale) */
    rating: number;

    /** Genre as a display string */
    genre: string;

    /** Release year */
    year: number;

    /** Release date (optional, YYYY-MM-DD format) */
    releaseDate?: string;

    /** Runtime duration as formatted string (optional) */
    duration?: string;

    /** Movie plot/overview (optional) */
    description?: string;

    /** Indicates if the movie is in user's favorites */
    isFavorite: boolean;
}
