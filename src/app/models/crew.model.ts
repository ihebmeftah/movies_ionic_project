/**
 * Crew Model
 *
 * Represents a crew member (director, producer, cinematographer, etc.) in a movie.
 *
 * Used in:
 * - MoviesService: To fetch crew information for movies
 * - MovieDetailsPage: To display director, producers, and other crew members
 * - Credits: As part of the movie credits information
 *
 * @interface Crew
 */
export interface Crew {
    /** Indicates if the person is an adult performer */
    adult: boolean;

    /** Gender identifier (0 = not specified, 1 = female, 2 = male) */
    gender: number;

    /** Unique identifier for the person in TMDB */
    id: number;

    /** Department the person is primarily known for (e.g., "Directing", "Writing") */
    known_for_department: string;

    /** Display name of the crew member */
    name: string;

    /** Original name of the crew member */
    original_name: string;

    /** Popularity score of the crew member */
    popularity: number;

    /** Path to the profile image, or null if not available */
    profile_path: string | null;

    /** Credit identifier for this role */
    credit_id: string;

    /** Department this person worked in for this movie (e.g., "Production", "Camera") */
    department: string;

    /** Specific job title (e.g., "Director", "Screenplay", "Director of Photography") */
    job: string;
}
