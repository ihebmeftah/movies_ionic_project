import { Cast } from './cast.model';
import { Crew } from './crew.model';

/**
 * Credits Model
 *
 * Represents the complete credits (cast and crew) for a movie.
 *
 * Used in:
 * - MoviesService: To fetch complete credits information from TMDB API
 * - MovieDetailsPage: To display cast and crew information for a specific movie
 *
 * @interface Credits
 */
export interface Credits {
    /** Movie ID these credits belong to */
    id: number;

    /** Array of cast members (actors/actresses) in the movie */
    cast: Cast[];

    /** Array of crew members (directors, producers, etc.) in the movie */
    crew: Crew[];
}
