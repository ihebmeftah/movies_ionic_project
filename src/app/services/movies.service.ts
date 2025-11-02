import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(private http: HttpClient) { }

  /**
   * Fetch top-rated movies from TMDB API
   * @param page Page number (default: 1)
   * @returns Observable of MoviesResponse containing array of movies
   */
  getTopRatedMovies(page: number = 1): Observable<MoviesResponse> {
    const url = `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`;
    return this.http.get<MoviesResponse>(url);
  }

  /**
   * Fetch trending movies from TMDB API
   * @param page Page number (default: 1)
   * @returns Observable of MoviesResponse containing array of trending movies
   */
  getTrendingMovies(page: number = 1): Observable<MoviesResponse> {
    const url = `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}&page=${page}`;
    return this.http.get<MoviesResponse>(url);
  }

  /**
   * Fetch upcoming movies from TMDB API
   * @param page Page number (default: 1)
   * @returns Observable of MoviesResponse containing array of upcoming movies
   */
  getUpcomingMovies(page: number = 1): Observable<MoviesResponse> {
    const url = `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}`;
    return this.http.get<MoviesResponse>(url);
  }

  /**
   * Get the full poster URL for a movie
   * @param posterPath The poster path from the API
   * @returns Full URL to the poster image
   */
  getPosterUrl(posterPath: string): string {
    return posterPath ? `${this.imageBaseUrl}${posterPath}` : '';
  }

  /**
   * Get the full backdrop URL for a movie
   * @param backdropPath The backdrop path from the API
   * @returns Full URL to the backdrop image
   */
  getBackdropUrl(backdropPath: string): string {
    return backdropPath ? `${this.imageBaseUrl}${backdropPath}` : '';
  }

  /**
   * Fetch a single movie by ID from TMDB API
   * @param movieId The TMDB movie ID
   * @returns Observable of Movie details
   */
  getMovieById(movieId: number): Observable<Movie> {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    return this.http.get<Movie>(url);
  }

  /**
   * Fetch detailed movie information by ID from TMDB API
   * @param movieId The TMDB movie ID
   * @returns Observable of MovieDetails with full information
   */
  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    return this.http.get<MovieDetails>(url);
  }

  /**
   * Fetch movie credits (cast and crew) by ID from TMDB API
   * @param movieId The TMDB movie ID
   * @returns Observable of Credits containing cast and crew
   */
  getMovieCredits(movieId: number): Observable<Credits> {
    const url = `${this.baseUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`;
    return this.http.get<Credits>(url);
  }

  /**
   * Get the full profile URL for a person
   * @param profilePath The profile path from the API
   * @returns Full URL to the profile image
   */
  getProfileUrl(profilePath: string | null): string {
    return profilePath ? `${this.imageBaseUrl}${profilePath}` : '';
  }
}
