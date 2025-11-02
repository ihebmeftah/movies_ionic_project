/**
 * Favorite Movie Display Model
 *
 * Simplified interface for displaying favorite movies in the UI.
 * Contains only the essential information needed for display purposes.
 *
 * Used in:
 * - FavoritesService: To transform FavoriteMovie data for display in the UI
 * - FavoritesPage: To display the list of favorite movies in a simplified format
 * - HomePage: When showing favorite status indicators
 *
 * @interface FavoriteMovieDisplay
 */
export interface FavoriteMovieDisplay {
    /** TMDB movie ID */
    id: number;

    /** Title of the movie */
    title: string;

    /** Genre of the movie as a string */
    genre: string;

    /** Path to the movie's poster image */
    posterPath: string;

    /** Timestamp when the movie was added to favorites */
    addedAt: Date;
}
