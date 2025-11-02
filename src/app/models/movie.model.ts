/**
 * Movie Model
 *
 * Represents a movie object from The Movie Database (TMDB) API.
 *
 * Used in:
 * - MoviesService: To fetch and display movie data from TMDB API
 * - HomePage: To display trending and popular movies
 * - MoviesListPage: To display list of movies
 * - FavoritesService: As a base reference for favorite movies
 *
 * @interface Movie
 */
export interface Movie {
  /** Indicates if the movie is for adults only */
  adult: boolean;

  /** Path to the backdrop image (large background image) */
  backdrop_path: string;

  /** Array of genre IDs associated with the movie */
  genre_ids: number[];

  /** Unique identifier for the movie in TMDB */
  id: number;

  /** Original language of the movie (ISO 639-1 format) */
  original_language: string;

  /** Original title of the movie in its original language */
  original_title: string;

  /** Brief description/summary of the movie plot */
  overview: string;

  /** Popularity score of the movie */
  popularity: number;

  /** Path to the poster image */
  poster_path: string;

  /** Release date of the movie (YYYY-MM-DD format) */
  release_date: string;

  /** Display title of the movie */
  title: string;

  /** Indicates if there's a video trailer available */
  video: boolean;

  /** Average rating from user votes (0-10 scale) */
  vote_average: number;

  /** Total number of votes received */
  vote_count: number;
}
