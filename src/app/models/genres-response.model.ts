import { Genre } from './genre.model';

/**
 * Genres Response Model
 *
 * Represents the response structure when fetching all genres from TMDB API.
 *
 * Used in:
 * - CategoriesService: To receive the complete list of movie genres from TMDB API
 * - CategoryPage: To populate the category selection interface
 *
 * @interface GenresResponse
 */
export interface GenresResponse {
    /** Array of all available movie genres */
    genres: Genre[];
}
