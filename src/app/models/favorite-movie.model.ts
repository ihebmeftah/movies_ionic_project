/**
 * Favorite Movie Model
 *
 * Represents a movie saved to a user's favorites in Firestore.
 * This interface contains both movie data and user information for tracking purposes.
 *
 * Used in:
 * - FavoritesService: To save and retrieve favorite movies from Firestore
 * - MovieDetailsPage: When adding/removing movies to/from favorites
 * - FavoritesPage: To display user's favorite movies
 *
 * @interface FavoriteMovie
 */
export interface FavoriteMovie {
    /** User ID who favorited the movie */
    userId: string;

    /** Display name of the user (optional) */
    userDisplayName?: string;

    /** Email address of the user (optional) */
    userEmail?: string;

    /** TMDB movie ID */
    movieId: number;

    /** Title of the movie */
    movieTitle: string;

    /** Genre of the movie as a string */
    movieGenre: string;

    /** Path to the movie's poster image */
    posterPath: string;

    /** Timestamp when the movie was added to favorites */
    addedAt: Date;
}
