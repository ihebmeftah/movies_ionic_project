/**
 * Cast Model
 *
 * Represents a cast member (actor/actress) in a movie.
 *
 * Used in:
 * - MoviesService: To fetch cast information for movies
 * - MovieDetailsPage: To display actors and their characters
 * - Credits: As part of the movie credits information
 *
 * @interface Cast
 */
export interface Cast {
  /** Indicates if the person is an adult performer */
  adult: boolean;

  /** Gender identifier (0 = not specified, 1 = female, 2 = male) */
  gender: number;

  /** Unique identifier for the person in TMDB */
  id: number;

  /** Department the person is primarily known for (e.g., "Acting") */
  known_for_department: string;

  /** Display name of the actor/actress */
  name: string;

  /** Original name of the actor/actress */
  original_name: string;

  /** Popularity score of the actor/actress */
  popularity: number;

  /** Path to the profile image, or null if not available */
  profile_path: string | null;

  /** Unique identifier for this specific casting */
  cast_id: number;

  /** Name of the character played in the movie */
  character: string;

  /** Credit identifier for this role */
  credit_id: string;

  /** Display order in the cast list (lower numbers appear first) */
  order: number;
}
