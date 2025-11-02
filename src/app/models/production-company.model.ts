/**
 * Production Company Model
 *
 * Represents a production company involved in making a movie.
 *
 * Used in:
 * - MovieDetails: To display production companies for a specific movie
 * - MoviesService: As part of detailed movie information
 *
 * @interface ProductionCompany
 */
export interface ProductionCompany {
    /** Unique identifier for the production company */
    id: number;

    /** Path to the company's logo image, or null if not available */
    logo_path: string | null;

    /** Name of the production company */
    name: string;

    /** Country of origin for the company (ISO 3166-1 format) */
    origin_country: string;
}
