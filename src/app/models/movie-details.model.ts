import { Genre } from './genre.model';
import { ProductionCompany } from './production-company.model';

/**
 * Movie Details Model
 *
 * Represents detailed information about a specific movie from TMDB API.
 * This interface contains more comprehensive data than the basic Movie interface.
 *
 * Used in:
 * - MoviesService: To fetch detailed information for a specific movie
 * - MovieDetailsPage: To display comprehensive movie information including budget, runtime, etc.
 *
 * @interface MovieDetails
 */
export interface MovieDetails {
    /** Indicates if the movie is for adults only */
    adult: boolean;

    /** Path to the backdrop image (large background image) */
    backdrop_path: string;

    /** Production budget in US dollars */
    budget: number;

    /** Array of genre objects associated with the movie */
    genres: Genre[];

    /** Official website URL of the movie */
    homepage: string;

    /** Unique identifier for the movie in TMDB */
    id: number;

    /** IMDb ID of the movie */
    imdb_id: string;

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

    /** Array of production companies involved in making the movie */
    production_companies: ProductionCompany[];

    /** Release date of the movie (YYYY-MM-DD format) */
    release_date: string;

    /** Total revenue earned in US dollars */
    revenue: number;

    /** Runtime duration in minutes */
    runtime: number;

    /** Current status of the movie (e.g., "Released", "In Production") */
    status: string;

    /** Movie tagline or slogan */
    tagline: string;

    /** Display title of the movie */
    title: string;

    /** Indicates if there's a video trailer available */
    video: boolean;

    /** Average rating from user votes (0-10 scale) */
    vote_average: number;

    /** Total number of votes received */
    vote_count: number;
}
